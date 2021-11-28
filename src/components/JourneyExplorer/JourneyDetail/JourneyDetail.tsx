import React, { useCallback, useState } from "react";
import classes from "./JourneyDetail.module.scss";

import { ProcessedJourney, RawPhoto } from "../Journey.interface"; // Temporary
import ExplorerHeader from "../Layouts/ExplorerHeader/ExplorerHeader";
import PhotoGrid from "../Layouts/PhotoGrid/PhotoGrid";
import PhotoForm from "../PhotoForm/PhotoForm";

type JourneyDetailProps = {
  isActive: boolean;
  journey: ProcessedJourney | null;
  onCloseDetail: () => void;
  onDeleteJourney: (targetJourney: ProcessedJourney) => void;
};

const formatDate = (startDate: string, endDate: string): string => {
  const formattedStartDate = startDate.substring(0, 10).replace(/-/g, ".");
  const formattedEndDate = endDate.substring(0, 10).replace(/-/g, ".");

  return `${formattedStartDate} - ${formattedEndDate}`;
};

function JourneyDetail({
  isActive,
  journey,
  onCloseDetail,
  onDeleteJourney,
}: JourneyDetailProps) {
  const [isUploadFormActive, setUploadFormActive] = useState(false);

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

  const toggleForm = () => {
    setUploadFormActive((isUploadFormActive) => !isUploadFormActive);
  };

  const appendToPhotoList = useCallback(
    (uploadedPhotos: RawPhoto[]) => {
      if (!journey) {
        return;
      }

      const processedPhotos = uploadedPhotos.map((photo) => {
        return {
          ...photo,
          path: `http://localhost:3030/${photo.path.substring(6)}`,
        };
      });

      journey.photos = [...journey.photos, ...processedPhotos];
    },
    [journey]
  );

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
        <React.Fragment>
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
                <button onClick={toggleForm}>사진 추가</button>
              </div>
            </section>

            <div className={classes.divider}></div>

            <section className={classes["detail-content-section"]}>
              <PhotoGrid photos={journey.photos}></PhotoGrid>
            </section>
          </article>

          <PhotoForm
            isActive={isUploadFormActive}
            journeyTitle={journey.title}
            onUpload={appendToPhotoList}
            onCloseForm={toggleForm}
          ></PhotoForm>
        </React.Fragment>
      )}
    </div>
  );
}

export default JourneyDetail;
