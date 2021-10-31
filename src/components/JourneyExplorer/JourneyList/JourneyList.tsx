import React from "react";
import classes from "./JourneyList.module.scss";

import { Journey } from "../constants/journey-data"; // Temporary
import JourneyItem from "../JourneyItem/JourneyItem";

type JourneyListProps = {
  // isActive: boolean;
  journeys: Journey[];
  onSelectJourney: (event: React.MouseEvent) => void;
};

function JourneyList(props: JourneyListProps) {
  const journeyItems = props.journeys.map((journey) => (
    <JourneyItem
      path={journey.path}
      onClick={props.onSelectJourney}
    ></JourneyItem>
  ));

  return <section className={classes["journey-list"]}>{journeyItems}</section>;
}

export default JourneyList;
