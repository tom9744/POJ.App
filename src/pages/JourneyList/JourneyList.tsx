import { useJourneyList } from "./hooks/useJourneyList";
import classes from "./JourneyList.module.scss";
import JourneyListItem from "./JourneyListItem/JourneyListItem";
import SearchBar from "./SearchBar/SearchBar";

function JourneyList() {
  const { journeyList } = useJourneyList();

  return (
    <article className={classes["journey-list-container"]}>
      <SearchBar></SearchBar>

      <ul className={classes["journey-list-wrapper"]}>
        {journeyList.map((journey) => {
          return <JourneyListItem journey={journey}></JourneyListItem>;
        })}
      </ul>
    </article>
  );
}

export default JourneyList;
