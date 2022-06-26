import { useCallback, useEffect, useState } from "react";
import Footer from "../../components/UI/Footer/Footer";
import Header from "../../components/UI/Header/Header";
import { IJoureny } from "../../models/journey.model";
import { useJourneyList } from "./hooks/useJourneyList";
import classes from "./JourneyList.module.scss";
import JourneyListItem from "./JourneyListItem/JourneyListItem";
import SearchBar from "./SearchBar/SearchBar";

function JourneyList() {
  const { journeyList, setJourneyList } = useJourneyList();

  const [searchResult, setSearchResult] = useState<IJoureny[]>([]);
  const [keyword, setKeyword] = useState<string>("");

  const searchHandler = useCallback((keyword: string) => {
    setKeyword(keyword);
  }, []);

  const deleteJourneyHandler = useCallback(
    (journeyId: number): void => {
      setJourneyList(journeyList.filter((journey) => journey.id !== journeyId));
    },
    [journeyList, setJourneyList]
  );

  useEffect((): void => {
    if (!keyword) {
      setSearchResult(journeyList);
      return;
    }
    // NOTE: 제목 또는 설명에 키워드가 포함되어 있는 데이터를 추출합니다.
    const searchResult = journeyList.filter(({ title, description }) => title.includes(keyword) || description.includes(keyword));
    setSearchResult(searchResult);
  }, [keyword, journeyList]);

  return (
    <article className={classes["journey-list-container"]}>
      <Header></Header>

      <SearchBar onSearch={searchHandler}></SearchBar>

      <ul className={classes["journey-list-wrapper"]}>
        {searchResult.map((journey) => {
          return <JourneyListItem key={journey.id} journey={journey} onDelete={deleteJourneyHandler}></JourneyListItem>;
        })}
      </ul>

      <Footer></Footer>
    </article>
  );
}

export default JourneyList;
