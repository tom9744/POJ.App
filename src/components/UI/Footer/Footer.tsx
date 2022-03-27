import { MdOutlinePlaylistAdd } from "react-icons/md";
import classes from "./Footer.module.scss";

function Footer() {
  return (
    <footer className={classes["footer-wrapper"]}>
      <MdOutlinePlaylistAdd className={classes.icon} />
    </footer>
  );
}

export default Footer;
