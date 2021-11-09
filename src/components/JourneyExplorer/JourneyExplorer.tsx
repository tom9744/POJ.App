import React, { useEffect, useState } from "react";
import JourneyForm from "./JourneyForm/JourneyForm";
import classes from "./JourneyExplorer.module.scss";

import JourneyList from "./JourneyList/JourneyList";
import JourneyDetail from "./JourneyDetail/JourneyDetail";
import ExplorerHeader from "./ExplorerHeader/ExplorerHeader";
import { RawJourney, ProcessedJourney } from "./constants/journey-data";

type JourneyExplorerProps = {
  isActive: boolean;
  onCloseExplorer: (event: React.MouseEvent) => void;
};

// Requests journey data to the server.
const requestJourneys = async (): Promise<RawJourney[]> => {
  const response = await fetch("http://localhost:3030/journeys");
  const body: RawJourney[] = await response.json();

  // [Note] Responses with a code either 40X or 50X is not an error.
  if (!response.ok) {
    throw body;
  }

  return body;
};

const processJourneyData = (rawJourney: RawJourney): ProcessedJourney => {
  return {
    ...rawJourney,
    thumbNailPath:
      rawJourney.photos?.length > 0
        ? `http://localhost:3030/${rawJourney.photos[0].path.substring(6)}`
        : ``,
  };
};

const defaultJourney: ProcessedJourney = {
  thumbNailPath: "",
  id: 0,
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  photos: [],
};

function JourneyExplorer(props: JourneyExplorerProps) {
  const [isFormActive, setFormActive] = useState<boolean>(false);
  const [isDetailActive, setDetailActive] = useState<boolean>(false);
  const [journeys, setJourneys] = useState<ProcessedJourney[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<ProcessedJourney>();

  useEffect(() => {
    requestJourneys().then((journeys) => {
      const temporaryJourneys = journeys.map((journey) =>
        processJourneyData(journey)
      );

      setJourneys(temporaryJourneys);
    });
  }, []);

  const openForm = () => {
    setFormActive(true);
  };

  const closeForm = () => {
    setFormActive(false);
  };

  const openDetail = (index: number) => {
    setSelectedJourney(journeys[index]);
    setDetailActive(true);
  };

  const closeDetail = () => {
    setDetailActive(false);
  };

  const addContent = (journey: RawJourney) => {
    const temporaryJourney = processJourneyData(journey);

    setJourneys((currentState) => [temporaryJourney, ...currentState]);
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
          journey={selectedJourney}
          onCloseDetail={closeDetail}
        ></JourneyDetail>

        <JourneyForm
          isActive={isFormActive}
          onCloseForm={closeForm}
          onContentAdded={addContent}
        ></JourneyForm>
      </div>
    </div>
  );
}

export default JourneyExplorer;
