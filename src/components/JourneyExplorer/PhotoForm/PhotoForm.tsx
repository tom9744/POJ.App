import React, { useState } from "react";
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

  const fileInputHandler = async (event: React.ChangeEvent) => {
    const fileList = (event.target as HTMLInputElement).files;

    if (!fileList || fileList.length > 20) {
      return;
    }

    const files = Array(fileList.length)
      .fill(null)
      .map((_, index) => fileList[index]);

    const imageUrls = await readFilesAsDataURL(files);

    setPreviewList(imageUrls);
  };

  const uploadPhotos = (event: React.MouseEvent) => {
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
  };

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

        <div className={classes.preview}>
          {previewList.map((previewURL) => {
            return <img src={previewURL} alt="" />;
          })}
        </div>

        <form className={classes.form}>
          <label htmlFor="newPhotos">사진</label>
          <input
            type="file"
            id="newPhotos"
            accept=".jpg"
            onChange={fileInputHandler}
            multiple
          />
          <button onClick={uploadPhotos}>추가</button>
        </form>
      </div>
    </React.Fragment>
  );
}

export default PhotoForm;
