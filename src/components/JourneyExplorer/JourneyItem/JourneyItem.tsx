import React from "react";
import "./JourneyItem.scss";

type JourneyProps = {
  path: string;
  onClick: (event: React.MouseEvent) => void;
};

function JourneyItem(props: JourneyProps) {
  return (
    <div className="journey" onClick={props.onClick}>
      {/* 대표 사진 */}
      <img src={props.path || "/images/dummy.jpg"} alt="" />

      {/* 여행 이름 */}
      <span>부산 해운대</span>
    </div>
  );
}

export default JourneyItem;
