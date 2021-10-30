import React, { useState } from "react";
import Journey from "./Journey/Journey";
import JourneyForm from "./JourneyForm/JourneyForm";
import "./JourneyExplorer.scss";

import { journeys } from "./constants/journey-data"; // Temporary

type JourneyExplorerProps = {
  isActive: boolean;
  onCloseExplorer: (event: React.MouseEvent) => void;
};

function JourneyExplorer(props: JourneyExplorerProps) {
  const [isFormActive, setFormActive] = useState<boolean>(false);

  const openForm = () => {
    setFormActive(true);
  };

  const closeForm = (event: React.MouseEvent) => {
    setFormActive(false);
  };

  return (
    <div
      className={`explorer-wrapper ${props.isActive ? "active" : "deactive"}`}
    >
      <section className="explorer-header">
        <button className="create-button" onClick={openForm}>
          기록 남기기
        </button>

        <div className="spacer"></div>

        <button className="close-button" onClick={props.onCloseExplorer}>
          닫기
        </button>
      </section>

      <section className="explorer-content">
        {journeys.map((journey) => (
          <Journey path={journey.path}></Journey>
        ))}
      </section>

      <div>
        <JourneyForm
          isActive={isFormActive}
          onCloseForm={closeForm}
        ></JourneyForm>
      </div>
    </div>
  );
}

export default JourneyExplorer;
