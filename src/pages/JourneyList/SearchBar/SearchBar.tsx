import classes from "./SearchBar.module.scss";
import { FaSearch } from "react-icons/fa";
import { useCallback, useState } from "react";

type SearchBarProp = {
  onSearch: (keyword: string) => void;
};

function SearchBar({ onSearch }: SearchBarProp) {
  const [value, setValue] = useState<string>("");

  const submitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      onSearch(value);
    },
    [value, onSearch]
  );

  const inputHandler = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;

    setValue(target.value);
  }, []);

  return (
    <form className={classes["search-bar-wrapper"]} onSubmit={submitHandler}>
      <FaSearch className={`${classes["search-icon"]}`} />
      <input className={classes["search-bar"]} type="text" value={value} onInput={inputHandler} />
      <button className={classes["search-button"]}>검색</button>
    </form>
  );
}

export default SearchBar;
