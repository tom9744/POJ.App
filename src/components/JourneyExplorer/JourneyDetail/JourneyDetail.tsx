import React from "react";
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

function JourneyDetail(props: JourneyDetailProps) {
  const { isActive, journey, onCloseDetail, onDeleteJourney } = props;

  const editJourney = () => {};

  const deleteJourney = () => {
    if (!journey) {
      return;
    }

    // [TODO] Add Confrim Logic
    fetch(`http://localhost:3030/journeys/${journey.id}`, {
      method: "DELETE",
    });

    onDeleteJourney(journey);
    onCloseDetail();
  };

  const formatDate = (startDate: string, endDate: string): string => {
    const formattedStartDate = startDate.substring(0, 10).replace("-", ".");
    const formattedEndDate = endDate.substring(0, 10).replace("-", ".");

    return `${formattedStartDate} - ${formattedEndDate}`;
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
          { type: "text", textContent: "편집", handler: () => {} },
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
              <button>사진 추가</button>
            </div>
          </section>

          <div className={classes.divider}></div>

          <section className={classes["detail-content-section"]}>
            <PhotoGrid photos={journey.photos}></PhotoGrid>
          </section>
        </article>
      )}
    </div>
  );
}

export default JourneyDetail;
