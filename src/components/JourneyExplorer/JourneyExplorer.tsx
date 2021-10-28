import React from "react";
import Journey from "./Journey/Journey";
import "./JourneyExplorer.scss";

type JourneyExplorerProps = {
  isActive: boolean;
  onCloseExplorer: (event: React.MouseEvent) => void;
};

function JourneyExplorer(props: JourneyExplorerProps) {
  const journeys = [
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
    { path: "" },
  ];

  return (
    <div
      className={`explorer-wrapper ${props.isActive ? "active" : "deactive"}`}
    >
      <section className="explorer-header">
        <button className="create-button">새로 기록하기</button>

        <div className="spacer"></div>

        <button className="close-button" onClick={props.onCloseExplorer}>
          X
        </button>
      </section>

      <section className="explorer-content">
        {journeys.map((journey) => (
          <Journey path={journey.path}></Journey>
        ))}
      </section>
    </div>
  );
}

export default JourneyExplorer;
