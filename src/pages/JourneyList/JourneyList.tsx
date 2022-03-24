import { useEffect, useState } from "react";
import useHttp from "../../hooks/useHttp";
import { IJourneyData } from "./JourneyData.model";
import classes from "./JourneyList.module.scss";
import JourneyListItem from "./JourneyListItem/JourneyListItem";
import SearchBar from "./SearchBar/SearchBar";

function JourneyList() {
  const [journeyList, setJourneyList] = useState<IJourneyData[]>([]);
  const { requestState, sendRequest: requestJourneyList } = useHttp<IJourneyData[]>();

  useEffect((): void => {
    requestJourneyList({ url: "https://var-resa.link/journeys" })
      .then((journeyList) => {
        setJourneyList(journeyList);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [requestJourneyList]);

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
