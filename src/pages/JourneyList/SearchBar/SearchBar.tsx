import classes from "./SearchBar.module.scss";
import { FaSearch } from "react-icons/fa";

function SearchBar() {
  return (
    <form className={classes["search-bar-wrapper"]}>
      <FaSearch className={`${classes["search-icon"]}`} />
      <input className={classes["search-bar"]} type="text" />
      <button className={classes["search-button"]}>검색</button>
    </form>
  );
}

export default SearchBar;
