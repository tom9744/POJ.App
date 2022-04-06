import Footer from "../../components/UI/Footer/Footer";
import Header from "../../components/UI/Header/Header";
import { useJourneyList } from "./hooks/useJourneyList";
import classes from "./JourneyList.module.scss";
import JourneyListItem from "./JourneyListItem/JourneyListItem";
import SearchBar from "./SearchBar/SearchBar";

function JourneyList() {
  const { journeyList } = useJourneyList();

  return (
    <article className={classes["journey-list-container"]}>
      <Header></Header>

      <SearchBar></SearchBar>

      <ul className={classes["journey-list-wrapper"]}>
        {journeyList.map((journey) => {
          return <JourneyListItem key={journey.id} journey={journey}></JourneyListItem>;
        })}
      </ul>

      <Footer></Footer>
    </article>
  );
}

export default JourneyList;
