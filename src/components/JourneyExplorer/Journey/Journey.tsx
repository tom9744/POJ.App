import React from "react";
import "./Journey.scss";

type JourneyProps = {
  path: string;
};

function Journey(props: JourneyProps) {
  return (
    <div className="journey">
      {/* 대표 사진 */}
      <img src={props.path || "/images/dummy.jpg"} alt="" />

      {/* 여행 이름 */}
      <span>부산 해운대</span>
    </div>
  );
}

export default Journey;
