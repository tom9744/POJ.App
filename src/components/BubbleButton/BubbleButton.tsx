import React from "react";
import styles from "./BubbleButton.module.css";

type BubbleButtonProps = { onBubbleClick: (event: React.MouseEvent) => void };

function BubbleButton(props: BubbleButtonProps) {
  return <div className={styles.bubble} onClick={props.onBubbleClick}></div>;
}

export default BubbleButton;
