import React, { useState } from "react";
import JourneyForm from "./JourneyForm/JourneyForm";
import classes from "./JourneyExplorer.module.scss";

import { journeys } from "./constants/journey-data"; // Temporary
import JourneyList from "./JourneyList/JourneyList";
import JourneyDetail from "./JourneyDetail/JourneyDetail";
import ExplorerHeader from "./ExplorerHeader/ExplorerHeader";

type JourneyExplorerProps = {
  isActive: boolean;
  onCloseExplorer: (event: React.MouseEvent) => void;
};

function JourneyExplorer(props: JourneyExplorerProps) {
  const [isFormActive, setFormActive] = useState<boolean>(false);
  const [isDetailActive, setDetailActive] = useState<boolean>(false);

  const openForm = () => {
    setFormActive(true);
  };

  const closeForm = (event: React.MouseEvent) => {
    setFormActive(false);
  };

  const openDetail = (event: React.MouseEvent) => {
    setDetailActive(true);
  };

  const closeDetail = (event: React.MouseEvent) => {
    setDetailActive(false);
  };

  return (
    <div
      className={`${classes["explorer-wrapper"]} ${
        props.isActive ? classes.active : classes.deactive
      }`}
    >
      <ExplorerHeader
        close
        onClose={props.onCloseExplorer}
        leftButtons={[
          { type: "block", textContent: "기록 남기기", handler: openForm },
        ]}
      ></ExplorerHeader>

      <JourneyList
        journeys={journeys}
        onSelectJourney={openDetail}
      ></JourneyList>

      <div className={classes["component-slot"]}>
        <JourneyDetail
          isActive={isDetailActive}
          journey={journeys[0]}
          onCloseDetail={closeDetail}
        ></JourneyDetail>

        <JourneyForm
          isActive={isFormActive}
          onCloseForm={closeForm}
        ></JourneyForm>
      </div>
    </div>
  );
}

export default JourneyExplorer;
