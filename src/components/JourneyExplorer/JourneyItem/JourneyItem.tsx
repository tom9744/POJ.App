import React from "react";
import { ProcessedJourney } from "../Journey.interface";
import classes from "./JourneyItem.module.scss";

type JourneyProps = {
  journey: ProcessedJourney;
  onClick: (event: React.MouseEvent) => void;
};

function JourneyItem({ journey, onClick }: JourneyProps) {
  const { title, description, elapsedDate } = journey;

  return (
    <div className={classes["journey-item"]} onClick={onClick}>
      <div className={classes["title-wrapper"]}>
        <span className={classes.title}>{title}</span>
        <div className={classes.spacer}></div>
        <span className={classes.elapsed}>{elapsedDate.generateText()}</span>
      </div>

      <div className={classes["desc-wrapper"]}>
        <span className={classes.description}>{description}</span>
      </div>
    </div>
  );
}

export default JourneyItem;
