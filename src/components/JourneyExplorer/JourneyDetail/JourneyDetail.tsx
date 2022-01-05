import React, { useCallback, useMemo, useState } from "react";
import classes from "./JourneyDetail.module.scss";

import { ProcessedJourney, ProcessedPhoto, RawPhoto } from "../Journey.interface"; // Temporary
import ExplorerHeader from "../Layouts/ExplorerHeader/ExplorerHeader";
import PhotoGrid from "../Layouts/PhotoGrid/PhotoGrid";
import PhotoForm from "../PhotoForm/PhotoForm";
import useHttp from "../../../hooks/useHttp";

type JourneyDetailProps = {
  isActive: boolean;
  journey: ProcessedJourney | null;
  onCloseDetail: () => void;
  onUploadPhotos: (uploadedPhotos: RawPhoto[]) => void;
  onDeletePhoto: (targetPhoto: ProcessedPhoto) => void;
  onDeleteJourney: (targetJourney: ProcessedJourney) => void;
};

enum Mode {
  NORMAL,
  EDIT,
}

function JourneyDetail({
  isActive,
  journey,
  onCloseDetail,
  onUploadPhotos,
  onDeletePhoto,
  onDeleteJourney,
}: JourneyDetailProps) {
  const [currentMode, setCurrentMode] = useState<Mode>(Mode.NORMAL);
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const { requestState, sendRequest } = useHttp<void>();

  const isInEditMode = useMemo(() => currentMode === Mode.EDIT, [currentMode]);

  const toggleForm = () => {
    setShowPhotoForm((showPhotoForm) => !showPhotoForm);
  };

  const editJourney = () => {
    switch (currentMode) {
      case Mode.NORMAL:
        setCurrentMode(Mode.EDIT);
        break;
      case Mode.EDIT:
        setCurrentMode(Mode.NORMAL);
        break;
    }
  };

  // TODO: Implement Confrimation Modal
  const deleteJourney = async () => {
    if (!journey || !window.confirm("정말 일정을 삭제하시겠습니까?")) {
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

  // TODO: Implement Confrimation Modal
  const deletePhoto = async (photo: ProcessedPhoto) => {
    if (!journey || !photo || !window.confirm("정말 사진을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await sendRequest({
        url: `http://localhost:3030/photos/${photo.id}`,
        options: { method: "DELETE" },
      });

      onDeletePhoto(photo);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`${classes["detail-wrapper"]} ${isActive ? classes.open : classes.close}`}>
      <ExplorerHeader
        backward
        onBackward={onCloseDetail}
        isBackwardDisabled={isInEditMode}
        rightButtons={[
          {
            type: "text",
            textContent: isInEditMode ? "완료" : "편집",
            handler: editJourney,
            isDisabled: requestState.showLoading,
          },
          {
            type: "text",
            textContent: "삭제",
            handler: deleteJourney,
            isDisabled: isInEditMode || requestState.showLoading,
          },
        ]}
      ></ExplorerHeader>

      {!!journey && (
        <React.Fragment>
          <article className={classes["detail-content"]}>
            <section className={classes["detail-content-section"]}>
              <h3 className={classes.title}>{journey.title}</h3>
              <span className={classes.description}>{`${journey.startDate} - ${journey.endDate}`}</span>
              <span className={classes.description}>총 {journey.photos.length} 장의 사진</span>

              <div className={classes["button-container"]}>
                <button onClick={toggleForm} disabled={isInEditMode || requestState.showLoading}>
                  사진 추가
                </button>
              </div>
            </section>

            <div className={classes.divider}></div>

            <section className={classes["detail-content-section"]}>
              <PhotoGrid isEditing={isInEditMode} photos={journey.photos} onDeletePhoto={deletePhoto}></PhotoGrid>
            </section>
          </article>

          <PhotoForm
            isActive={showPhotoForm}
            journeyTitle={journey.title}
            onUpload={onUploadPhotos}
            onCloseForm={toggleForm}
          ></PhotoForm>
        </React.Fragment>
      )}
    </div>
  );
}

export default JourneyDetail;
