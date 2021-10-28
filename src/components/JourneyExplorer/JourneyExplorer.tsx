import React from "react";
import Journey from "./Journey/Journey";
import "./JourneyExplorer.scss";

type JourneyExplorerProps = {
  isOpen: boolean;
};

function JourneyExplorer(props: JourneyExplorerProps) {
  const journeys = [
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
    { path: "/images/IMG_0050.JPG" },
  ];

  return props.isOpen ? (
    <section className="explorer-wrapper">
      {/* 왼쪽 연도별 탐색기 */}
      <div className="explorer-content">
        {journeys.map((journey) => (
          <Journey path={journey.path}></Journey>
        ))}
      </div>
    </section>
  ) : null;
}

export default JourneyExplorer;
