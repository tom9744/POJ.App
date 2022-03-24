import { RawJourney } from "../../../components/JourneyExplorer/Journey.interface";
import useElapsedDate from "../../../hooks/useElapsedDate";
import classes from "./JourneyListItem.module.scss";

type Props = {
  journey: RawJourney;
};

function JourneyListItem({ journey }: Props) {
  const elapsedDate = useElapsedDate(journey.startDate);

  return (
    <li className={classes["journey-list-item-container"]}>
      <div className={classes["title-wrapper"]}>
        <h3 className={classes.title}>{journey.title}</h3>
        <div className={classes.spacer}></div>
        <span className={classes["elapsed-date"]}>{elapsedDate.toString()}</span>
      </div>

      <div className={classes["description-wrapper"]}>
        <span className={classes["description"]}>{journey.description}</span>
      </div>
    </li>
  );
}

export default JourneyListItem;
