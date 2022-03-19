import classes from "./Header.module.scss";

function Header() {
  return (
    <header className={classes["header-wrapper"]}>
      <h1 className={classes["heading"]}>Resorna</h1>
    </header>
  );
}

export default Header;
