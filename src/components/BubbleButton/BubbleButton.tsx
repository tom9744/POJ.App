import React from "react";
import "./BubbleButton.scss";

type BubbleButtonProps = { onBubbleClick: (event: React.MouseEvent) => void };

function BubbleButton(props: BubbleButtonProps) {
  return <div className="bubble" onClick={props.onBubbleClick}></div>;
}

export default BubbleButton;
