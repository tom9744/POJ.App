import React from "react";
import { ProcessedJourney } from "../Journey.interface";
import classes from "./JourneyItem.module.scss";

type JourneyProps = {
  journey: ProcessedJourney;
  onClick: (event: React.MouseEvent) => void;
};

function JourneyItem(props: JourneyProps) {
  return (
    <div className={classes.journey} onClick={props.onClick}>
      <img src={props.journey.thumbNailPath || "/images/dummy.jpg"} alt="" />

      <span>{props.journey.title}</span>
    </div>
  );
}

export default JourneyItem;
