import { useCallback, useContext } from "react";
import { AppDispatchContext, AppStateContext } from "../../App";
import classes from "./BubbleButton.module.scss";

function BubbleButton() {
  const appState = useContext(AppStateContext);
  const appDispatch = useContext(AppDispatchContext);

  const toggleButton = useCallback(() => {
    appDispatch({ type: "ACTIVATE_EXPLORER" });
  }, [appDispatch]);

  return (
    <div
      className={`${classes.bubble} ${appState.isButtonActive ? classes.active : classes.deactive}`}
      onClick={toggleButton}
    ></div>
  );
}

export default BubbleButton;
