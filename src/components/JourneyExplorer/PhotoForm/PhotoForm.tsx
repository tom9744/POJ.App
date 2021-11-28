import React, { useCallback, useRef, useState } from "react";
import ExplorerHeader from "../Layouts/ExplorerHeader/ExplorerHeader";
import classes from "./PhotoForm.module.scss";

type PhotoFormProps = {
  isActive: boolean;
  journeyTitle: string;
  onConfirm: () => void;
  onCloseForm: () => void;
};

/**
 * FileReader를 이용해 <input> 태그를 통해 전달받은 이미지 파일을 URL 형태로 변환합니다.
 * @param files 이미지 파일로 구성된 배열
 * @returns 모든 FileReader의 작업이 완료되면 귀결 상태로 전이하는 프로미스
 */
function readFilesAsDataURL(files: File[]): Promise<string[]> {
  return Promise.all(
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
}

function PhotoForm({
  isActive,
  journeyTitle,
  onConfirm,
  onCloseForm,
}: PhotoFormProps) {
  const [previewList, setPreviewList] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const photoInput = useRef<HTMLInputElement>(null);
  const previewContainer = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef<number>(0);
  const throttleScroll = useRef<boolean>(false);

  const openPhotoInput = useCallback((event: React.MouseEvent): void => {
    event.preventDefault();

    photoInput.current?.click();
  }, []);

  const fileInputHandler = useCallback(async (event: React.ChangeEvent) => {
    const inputElem = event.target as HTMLInputElement;
    const fileList = inputElem.files;

    if (!fileList || fileList.length > 20) {
      alert("한 번에 20장 미만의 사진만 업로드 할 수 있습니다.");
      setPhotoFiles([]);
      setPreviewList([]);
      inputElem.value = "";
      return;
    }

    const files = Array(fileList.length)
      .fill(null)
      .map((_, index) => fileList[index]);

    const imageUrls = await readFilesAsDataURL(files);

    setPhotoFiles(files);
    setPreviewList(imageUrls);
  }, []);

  const uploadPhotos = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      if (!journeyTitle || photoFiles.length <= 0) {
        // [TODO] Notify that an error has occured.
        return;
      }

      const formData = new FormData();
      formData.append("journeyTitle", journeyTitle);
      photoFiles.forEach((file) => {
        formData.append(`images`, file);
      });

      // [TODO] Implement Confrimation Logic
      fetch("http://localhost:3030/photos", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          onCloseForm();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [journeyTitle, onCloseForm, photoFiles]
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

    setTimeout(() => {
      currPreviewConatiner.scroll({
        left: nextScrollPosition,
        behavior: "smooth",
      });

      scrollPosition.current = nextScrollPosition; // Update useRef's value
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
          {previewList.length > 0 ? (
            previewList.map((previewURL, index) => {
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
