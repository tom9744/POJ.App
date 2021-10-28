import React from "react";
import "./Journey.scss";

type JourneyProps = {
  path: string;
};

function Journey(props: JourneyProps) {
  return (
    <div className="journey">
      {/* 대표 사진 */}
      <img src="/images/IMG_0050.JPG" alt="" />

      {/* 여행 이름 */}
      <span>Trip #1</span>
    </div>
  );
}

export default Journey;
