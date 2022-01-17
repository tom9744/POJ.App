import classes from "./JourneyList.module.scss";

import { ProcessedJourney } from "../Journey.interface";
import JourneyItem from "../JourneyItem/JourneyItem";

type JourneyListProps = {
  journeys: ProcessedJourney[];
  onSelectJourney: (index: number) => void;
};

function JourneyList(props: JourneyListProps) {
  const selectJourney = (index: number) => {
    props.onSelectJourney(index);
  };

  const journeyItems = props.journeys.map((journey, index) => (
    <JourneyItem key={journey.id} journey={journey} onClick={() => selectJourney(index)}></JourneyItem>
  ));

  return <section className={classes["journey-list"]}>{journeyItems}</section>;
}

export default JourneyList;
