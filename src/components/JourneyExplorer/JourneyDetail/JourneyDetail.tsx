import React, { useState } from "react";
import classes from "./JourneyDetail.module.scss";

import { ProcessedJourney } from "../Journey.interface"; // Temporary
import ExplorerHeader from "../Layouts/ExplorerHeader/ExplorerHeader";
import PhotoGrid from "../Layouts/PhotoGrid/PhotoGrid";

type JourneyDetailProps = {
  isActive: boolean;
  journey: ProcessedJourney | null;
  onCloseDetail: () => void;
  onDeleteJourney: (targetJourney: ProcessedJourney) => void;
};

const formatDate = (startDate: string, endDate: string): string => {
  const formattedStartDate = startDate.substring(0, 10).replace("-", ".");
  const formattedEndDate = endDate.substring(0, 10).replace("-", ".");

  return `${formattedStartDate} - ${formattedEndDate}`;
};

function JourneyDetail(props: JourneyDetailProps) {
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [isPhotoFormActive, setPhotoFormActive] = useState(false);

  const { isActive, journey, onCloseDetail, onDeleteJourney } = props;

  // [TODO] Implement Journey Edit Logic
  const editJourney = () => {};

  const deleteJourney = () => {
    if (!journey) {
      return;
    }

    // [TODO] Implement Confrimation Logic
    fetch(`http://localhost:3030/journeys/${journey.id}`, {
      method: "DELETE",
    });

    onDeleteJourney(journey);
    onCloseDetail();
  };

  const openPhotoForm = () => {};

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
    if (!journey || photoFiles.length <= 0) {
      return;
    }

    console.log(journey.title);

    const formData = new FormData();
    formData.append("journeyTitle", journey.title);
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      className={`${classes["detail-wrapper"]} ${
        isActive ? classes.open : classes.close
      }`}
    >
      <ExplorerHeader
        backward
        onBackward={onCloseDetail}
        rightButtons={[
          { type: "text", textContent: "편집", handler: editJourney },
          { type: "text", textContent: "삭제", handler: deleteJourney },
        ]}
      ></ExplorerHeader>

      {!!journey && (
        <article className={classes["detail-content"]}>
          <section className={classes["detail-content-section"]}>
            <h3 className={classes.title}>{journey.title}</h3>
            <span className={classes.description}>
              {formatDate(journey.startDate, journey.endDate)}
            </span>
            <span className={classes.description}>
              총 {journey.photos.length} 장의 사진
            </span>

            <div className={classes["button-container"]}>
              <button onClick={openPhotoForm}>사진 추가</button>
            </div>
          </section>

          <div className={classes.divider}>
            <label htmlFor="newPhotos">사진</label>
            <input
              type="file"
              id="newPhotos"
              accept=".jpg"
              onChange={fileInputHandler}
              multiple
            />
            <button onClick={uploadPhotos}>추가</button>
          </div>

          <section className={classes["detail-content-section"]}></section>

          <section className={classes["detail-content-section"]}>
            <PhotoGrid photos={journey.photos}></PhotoGrid>
          </section>
        </article>
      )}
    </div>
  );
}

export default JourneyDetail;
