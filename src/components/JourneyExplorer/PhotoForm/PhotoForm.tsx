import React, { useState } from "react";
import ExplorerHeader from "../Layouts/ExplorerHeader/ExplorerHeader";
import classes from "./PhotoForm.module.scss";

type PhotoFormProps = {
  isActive: boolean;
  journeyTitle: string;
  onConfirm: () => void;
  onCloseForm: () => void;
};

function PhotoForm({
  isActive,
  journeyTitle,
  onConfirm,
  onCloseForm,
}: PhotoFormProps) {
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const fileInputHandler = (event: React.ChangeEvent) => {
    const fileList = (event.target as HTMLInputElement).files;

    if (!fileList) {
      return;
    }

    const files = Array(fileList.length)
      .fill(null)
      .map((_, index) => fileList[index]);

    setPhotoFiles(files);
  };

  const uploadPhotos = (event: React.MouseEvent) => {
    event.preventDefault();

    if (!journeyTitle || photoFiles.length <= 0) {
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
