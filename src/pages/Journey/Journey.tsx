import { useParams } from "react-router-dom";
import { useJourney } from "../JourneyList/hooks/useJourneyList";
import classes from "./Journey.module.scss";

function Journey() {
  const { jourenyId } = useParams();
  const { journey } = useJourney(Number(jourenyId));

  return <article>{journey?.title}</article>;
}

export default Journey;
