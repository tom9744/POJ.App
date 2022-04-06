import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IJoureny } from "../hooks/useJourneyList";
import classes from "./JourneyListItem.module.scss";

type Props = {
  journey: IJoureny;
};

function JourneyListItem({ journey }: Props) {
  const navigate = useNavigate();

  const navigateToJounrey = useCallback(
    (journeyId: number) => {
      navigate(`/journeys/${journeyId}`);
    },
    [navigate]
  );

  return (
    <li className={classes["journey-list-item-container"]} onClick={() => navigateToJounrey(journey.id)}>
      <div className={classes["title-wrapper"]}>
        <h3 className={classes.title}>{journey.title}</h3>
        <div className={classes.spacer}></div>
        <span className={classes["elapsed-date"]}>{journey.elapsedDate.toString()}</span>
      </div>

      <div className={classes["description-wrapper"]}>
        <span className={classes["description"]}>{journey.description}</span>
      </div>
    </li>
  );
}

export default JourneyListItem;
