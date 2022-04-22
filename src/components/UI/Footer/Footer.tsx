import { useNavigate } from "react-router-dom";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import classes from "./Footer.module.scss";
import { useCallback } from "react";

function Footer() {
  const navigate = useNavigate();

  const navigateToForm = useCallback(() => {
    navigate("/form");
  }, [navigate]);

  return (
    <footer className={classes["footer-wrapper"]} onClick={navigateToForm}>
      <MdOutlinePlaylistAdd className={classes.icon} />
    </footer>
  );
}

export default Footer;
