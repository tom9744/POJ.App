import React from "react";
import classes from "./JourneyDetail.module.scss";

import { Journey, photos } from "../constants/journey-data"; // Temporary
import ExplorerHeader from "../ExplorerHeader/ExplorerHeader";

type JourneyDetailProps = {
  isActive: boolean;
  journey: Journey;
  onCloseDetail: (event: React.MouseEvent) => void;
};

function JourneyDetail(props: JourneyDetailProps) {
  const photoGrid = (
    <div className={classes["photo-grid"]}>
      {photos.map((photo) => (
        <img
          src={photo.path || "/images/dummy.jpg"}
          alt="Temporary Dummy"
          className={classes.image}
        />
      ))}
    </div>
  );

  return (
    <div
      className={`${classes["detail-wrapper"]} ${
        props.isActive ? classes.open : classes.close
      }`}
    >
      <ExplorerHeader
        backward={true}
        onBackward={props.onCloseDetail}
      ></ExplorerHeader>

      <article className={classes["detail-content"]}>
        <section className={classes["detail-content-section"]}>
          <h3 className={classes.title}>부산 해운대에서의 기록</h3>
          <span className={classes.description}>2021.10.08 - 2021.10.10</span>
          <span className={classes.description}>
            총 {photos.length} 장의 사진
          </span>

          <div className={classes["button-container"]}>
            <button>편집</button>
            <button>삭제</button>
          </div>
        </section>

        <div className={classes.divider}></div>

        <section className={classes["detail-content-section"]}>
          {photoGrid}
        </section>
      </article>
    </div>
  );
}

export default JourneyDetail;
