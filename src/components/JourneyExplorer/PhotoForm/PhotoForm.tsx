import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RawPhoto } from "../Journey.interface";
import ExplorerHeader from "../Layouts/ExplorerHeader/ExplorerHeader";
import classes from "./PhotoForm.module.scss";

type PhotoFormProps = {
  isActive: boolean;
  journeyTitle: string;
  onUpload: (uploadedPhotos: RawPhoto[]) => void;
  onCloseForm: () => void;
};

/**
 * FileReader를 이용해 <input> 태그를 통해 전달받은 이미지 파일을 URL 형태로 변환합니다.
 * @param files 이미지 파일로 구성된 배열
 * @returns 모든 FileReader의 작업이 완료되면 귀결 상태로 전이하는 프로미스
 */
async function readFilesAsDataURL(files: File[]): Promise<string[]> {
  const imageSrcList = await Promise.all(
    files.map((file): Promise<string> => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = () => {
          const dataUrl = fileReader.result as string;
          resolve(dataUrl);
        };

        fileReader.onerror = () => {
          const error = new Error(`Failed to read the file`);
          fileReader.abort();
          reject(error);
        };

        fileReader.readAsDataURL(file);
      });
    })
  );

  return imageSrcList;
}

function PhotoForm({
  isActive,
  journeyTitle,
  onUpload,
  onCloseForm,
}: PhotoFormProps) {
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const photoInput = useRef<HTMLInputElement>(null);
  const previewContainer = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef<number>(0);
  const throttleScroll = useRef<boolean>(false);

  const worker = useMemo(() => new Worker("./workers/resize-image.js"), []);

  useEffect(() => {
    worker.onmessage = (event: MessageEvent) => setPhotoPreviews(event.data);

    return () => worker.terminate(); // NOTE: To avoid memory leak error.
  }, [worker]);

  useEffect(() => {
    if (!previewContainer.current) {
      return;
    }
    // NOTE: Move to the initial scroll position when preview items are changed.
    previewContainer.current.scroll(0, 0);
    scrollPosition.current = 0;
  }, [photoPreviews]);

  const resizeImages = useCallback(
    async (imageUrls: string[]): Promise<void> => {
      const imageElems = await Promise.all(
        imageUrls.map(async (url) => {
          const imageElem = new Image();
          imageElem.src = url;

          await imageElem.decode(); // Wait for the image to be loaded

          return imageElem;
        })
      );

      // NOTE: Web Worker can't process HTMLImageElemnet Type. So, convert to ImageBitmap
      const bitmaps = await Promise.all(
        imageElems.map((imageElem) =>
          createImageBitmap(imageElem, 0, 0, imageElem.width, imageElem.height)
        )
      );

      worker.postMessage(bitmaps);
    },
    [worker]
  );

  const openPhotoInput = useCallback((event: React.MouseEvent): void => {
    event.preventDefault();

    if (photoInput.current) {
      photoInput.current.click();
    }
  }, []);

  const fileInputHandler = useCallback(
    async (event: React.ChangeEvent): Promise<void> => {
      const inputElem = event.target as HTMLInputElement;
      const fileList = inputElem.files;

      if (!fileList || fileList.length > 10) {
        alert("한 번에 10장 이하의 사진만 업로드 할 수 있습니다.");
        return;
      }

      const files = Array(fileList.length)
        .fill(null)
        .map((_, index) => fileList[index]);

      setPhotoFiles(files); // NOTE: Files to be uploaded to the server.

      const imageUrls = await readFilesAsDataURL(files);

      resizeImages(imageUrls);
    },
    [resizeImages]
  );

  const uploadPhotos = useCallback(
    async (event: React.MouseEvent) => {
      event.preventDefault();

      if (!journeyTitle || photoFiles.length <= 0) {
        alert("업로드 할 사진이 없습니다. 먼저 사진을 추가해주세요.");
        return;
      }

      const formData = new FormData();
      formData.append("journeyTitle", journeyTitle);
      photoFiles.forEach((file) => {
        formData.append(`images`, file);
      });

      const response = await fetch("http://localhost:3030/photos", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("업로드 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      const uploadedPhotos: RawPhoto[] = await response.json();

      onUpload(uploadedPhotos);
      onCloseForm();
    },
    [photoFiles, journeyTitle, onUpload, onCloseForm]
  );

  const moveToNextPhoto = useCallback((event: React.WheelEvent) => {
    if (!previewContainer.current || throttleScroll.current) {
      return;
    }

    const { currentTarget, deltaY } = event;
    const currScrollPosition = scrollPosition.current;
    const currPreviewConatiner = previewContainer.current;
    const maxWidth = currentTarget.scrollWidth; // Element's width (w/ invisible content)
    const unitWidth = currentTarget.clientWidth; // Element's width (w/o invisible content)

    let nextScrollPosition =
      deltaY > 0
        ? currScrollPosition + unitWidth
        : currScrollPosition - unitWidth;

    if (nextScrollPosition < 0) {
      nextScrollPosition = 0;
    }

    if (nextScrollPosition > maxWidth) {
      nextScrollPosition = maxWidth;
    }

    // NOTE: Throttling a scroll event
    setTimeout(() => {
      currPreviewConatiner.scroll({
        left: nextScrollPosition,
        behavior: "smooth",
      });

      // Update uesRef() variables' value
      scrollPosition.current = nextScrollPosition;
      throttleScroll.current = false;
    }, 200);

    throttleScroll.current = true;
  }, []);

  return (
    <React.Fragment>
      <div
        className={`${classes["uploader-fallback"]} ${
          isActive ? classes.active : classes.deactive
        }`}
      ></div>

      <div
        className={`${classes["uploader-wrapper"]} ${
          isActive ? classes.active : classes.deactive
        }`}
      >
        <ExplorerHeader
          rightButtons={[
            { type: "text", textContent: "닫기", handler: onCloseForm },
          ]}
        ></ExplorerHeader>

        <div
          className={classes.preview}
          onWheel={(event) => moveToNextPhoto(event)}
          ref={previewContainer}
        >
          {photoPreviews.length > 0 ? (
            photoPreviews.map((previewURL, index) => {
              return (
                <img src={previewURL} alt="" key={index} data-index={index} />
              );
            })
          ) : (
            <div className={classes["preview-placeholder"]}></div>
          )}
        </div>

        <p className={classes.description}>
          <span>사진을 추가한 뒤, 스크롤 하여</span>
          <span>미리보기를 확인할 수 있습니다.</span>
        </p>

        <form className={classes.form}>
          <label htmlFor="newPhotos"></label>
          <input
            type="file"
            id="newPhotos"
            accept=".jpg"
            onChange={fileInputHandler}
            multiple
            ref={photoInput}
          />

          <div className={classes["button-wrapper"]}>
            <button onClick={openPhotoInput}>사진 추가</button>
            <button onClick={uploadPhotos}>업로드</button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}

export default PhotoForm;
