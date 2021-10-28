import React from "react";
import "./BubbleButton.scss";

type BubbleButtonProps = {
  isActive: boolean;
  onBubbleClick: (event: React.MouseEvent) => void;
};

function BubbleButton(props: BubbleButtonProps) {
  return (
    <div
      className={`bubble ${props.isActive ? "active" : "deactive"}`}
      onClick={props.onBubbleClick}
    ></div>
  );
}

export default BubbleButton;
