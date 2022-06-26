import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IJoureny } from "../../../../models/journey.model";
import classes from "./JourneyListItem.module.scss";

type Props = { journey: IJoureny };

function JourneyListItem({ journey }: Props) {
  const navigate = useNavigate();

  const navigateToDetail = useCallback(
    (journeyId: number): void => {
      navigate(`/journeys/${journeyId}`);
    },
    [navigate]
  );

  return (
    <li className={classes["journey-list-item-container"]} onClick={() => navigateToDetail(journey.id)}>
      <div className={classes["journey-list-item-wrapper"]}>
        <div className={classes["title-wrapper"]}>
          <h3 className={classes.title}>{journey.title}</h3>
          <div className={classes.spacer}></div>
          <span className={classes["elapsed-date"]}>{journey.elapsedDate.toString()}</span>
        </div>

        <div className={classes["description-wrapper"]}>
          <span className={classes["description"]}>{journey.description}</span>
        </div>
      </div>
    </li>
  );
}

export default JourneyListItem;
