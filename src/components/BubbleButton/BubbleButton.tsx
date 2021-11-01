import React from "react";
import classes from "./BubbleButton.module.scss";

type BubbleButtonProps = {
  isActive: boolean;
  onBubbleClick: (event: React.MouseEvent) => void;
};

function BubbleButton(props: BubbleButtonProps) {
  return (
    <div
      className={`${classes.bubble} ${
        props.isActive ? classes.active : classes.deactive
      }`}
      onClick={props.onBubbleClick}
    ></div>
  );
}

export default BubbleButton;
