import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IJoureny } from "../../../../models/journey.model";
import { useDelete } from "../../hooks/useDelete";
import classes from "./JourneyListItem.module.scss";

type Props = {
  journey: IJoureny;
  onDelete: (journeyId: number) => void;
};

function JourneyListItem({ journey, onDelete }: Props) {
  const deleteItem = useDelete({ dataType: "JOURNEY" });
  const navigate = useNavigate();

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isSwiped, setIsSwiped] = useState<boolean>(false);

  const touchStartHandler = useCallback((event: React.TouchEvent<HTMLLIElement>) => {
    setTouchStartX(event.touches[0].pageX);
  }, []);

  const touchEndHandler = useCallback(
    (event: React.TouchEvent<HTMLLIElement>, journeyId: number): void => {
      if (!touchStartX) {
        return;
      }

      const touchEndX = event.changedTouches[0].pageX;

      if (touchStartX > touchEndX) {
        setIsSwiped(true);
        return;
      }

      if (!isSwiped && touchStartX === touchEndX) {
        navigate(`/journeys/${journeyId}`);
        return;
      }

      setIsSwiped(false);
      setTouchStartX(null);
    },
    [isSwiped, touchStartX, navigate]
  );

  const deleteHandler = useCallback(
    async (journeyId: number): Promise<void> => {
      if (!window.confirm("정말 일정을 삭제하시겠습니까?")) {
        return;
      }

      await deleteItem(journeyId);

      onDelete(journeyId);
    },
    [onDelete]
  );

  return (
    <li
      className={`${classes["journey-list-item-container"]} ${isSwiped && classes["swiped"]}`}
      onTouchStart={touchStartHandler}
      onTouchEnd={(event) => touchEndHandler(event, journey.id)}
    >
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

      <button className={classes["delete-button"]} onClick={() => deleteHandler(journey.id)}>
        삭제
      </button>
    </li>
  );
}

export default JourneyListItem;
