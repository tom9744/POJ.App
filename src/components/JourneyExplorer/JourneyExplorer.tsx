import React, { useState } from "react";
import JourneyForm from "./JourneyForm/JourneyForm";
import classes from "./JourneyExplorer.module.scss";

import { journeys } from "./constants/journey-data"; // Temporary
import JourneyList from "./JourneyList/JourneyList";
import JourneyDetail from "./JourneyDetail/JourneyDetail";

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
      <section className={classes["explorer-header"]}>
        <button className={classes["create-button"]} onClick={openForm}>
          기록 남기기
        </button>

        <div className={classes.spacer}></div>

        <button
          className={classes["close-button"]}
          onClick={props.onCloseExplorer}
        >
          닫기
        </button>
      </section>

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
