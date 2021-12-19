import React, { useCallback, useState } from "react";
import classes from "./JourneyDetail.module.scss";

import { ProcessedJourney, RawPhoto } from "../Journey.interface"; // Temporary
import ExplorerHeader from "../Layouts/ExplorerHeader/ExplorerHeader";
import PhotoGrid from "../Layouts/PhotoGrid/PhotoGrid";
import PhotoForm from "../PhotoForm/PhotoForm";
import { modifyImagePath } from "../JourneyService";
import useHttp from "../../../hooks/useHttp";

type JourneyDetailProps = {
  isActive: boolean;
  journey: ProcessedJourney | null;
  onCloseDetail: () => void;
  onDeleteJourney: (targetJourney: ProcessedJourney) => void;
};

function JourneyDetail({
  isActive,
  journey,
  onCloseDetail,
  onDeleteJourney,
}: JourneyDetailProps) {
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const { requestState, sendRequest } = useHttp<void>();

  const toggleForm = () => {
    setShowPhotoForm((showPhotoForm) => !showPhotoForm);
  };

  // TODO: Implement Journey Edit Logic
  const editJourney = () => {};

  // TODO: Implement Confrimation Modal
  const deleteJourney = async () => {
    if (!journey || !window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      await sendRequest({
        url: `http://localhost:3030/journeys/${journey.id}`,
        options: { method: "DELETE" },
      });

      onDeleteJourney(journey);
      onCloseDetail();
    } catch (error) {
      console.error(error);
    }
  };

  const appendToPhotoList = useCallback(
    (uploadedPhotos: RawPhoto[]) => {
      if (!journey) {
        return;
      }
      journey.photos = [...journey.photos, ...modifyImagePath(uploadedPhotos)];
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
          {
            type: "text",
            textContent: "편집",
            handler: editJourney,
            isDisabled: requestState.showLoading,
          },
          {
            type: "text",
            textContent: "삭제",
            handler: deleteJourney,
            isDisabled: requestState.showLoading,
          },
        ]}
      ></ExplorerHeader>

      {!!journey && (
        <React.Fragment>
          <article className={classes["detail-content"]}>
            <section className={classes["detail-content-section"]}>
              <h3 className={classes.title}>{journey.title}</h3>
              <span className={classes.description}>
                {`${journey.startDate} - ${journey.endDate}`}
              </span>
              <span className={classes.description}>
                총 {journey.photos.length} 장의 사진
              </span>

              <div className={classes["button-container"]}>
                <button
                  onClick={toggleForm}
                  disabled={requestState.showLoading}
                >
                  사진 추가
                </button>
              </div>
            </section>

            <div className={classes.divider}></div>

            <section className={classes["detail-content-section"]}>
              <PhotoGrid photos={journey.photos}></PhotoGrid>
            </section>
          </article>

          <PhotoForm
            isActive={showPhotoForm}
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
