import React, { useEffect, useState } from "react";
import JourneyForm from "./JourneyForm/JourneyForm";
import classes from "./JourneyExplorer.module.scss";

import JourneyList from "./JourneyList/JourneyList";
import JourneyDetail from "./JourneyDetail/JourneyDetail";
import ExplorerHeader from "./Layouts/ExplorerHeader/ExplorerHeader";
import { fetchJourneys, HttpError, processJourneys } from "./JourneyService";
import { RawJourney, ProcessedJourney, RawPhoto } from "./Journey.interface";

type JourneyExplorerProps = {
  isActive: boolean;
  onSelectJourney: (photos: RawPhoto[]) => void;
  onCloseExplorer: (event: React.MouseEvent) => void;
};

function JourneyExplorer(props: JourneyExplorerProps) {
  const [isFormActive, setFormActive] = useState<boolean>(false);
  const [isDetailActive, setDetailActive] = useState<boolean>(false);
  const [journeys, setJourneys] = useState<ProcessedJourney[]>([]);
  const [selectedJourney, setSelectedJourney] =
    useState<ProcessedJourney | null>(null);

  // NOTE: Cannot use async/await in useEffect Hook.
  useEffect((): void => {
    fetchJourneys()
      .then((journeys) => {
        const processedJourney = processJourneys(journeys);

        setJourneys(processedJourney);
      })
      .catch((error) => {
        // TODO: Should improve the error handling logic to enhance UX.
        if (error instanceof HttpError) {
          alert("Could not fetch data from the server. Please try later.");
        } else {
          alert("Could not reach out to the server. Please try later.");
        }
      });
  }, []);

  const toggleJourneyForm = (): void => {
    setFormActive((isFormActive) => !isFormActive);
  };

  const openDetail = (index: number): void => {
    const selectedJourney = journeys[index];

    props.onSelectJourney(selectedJourney.photos);
    setSelectedJourney(selectedJourney);
    setDetailActive(true);
  };

  const closeDetail = (): void => {
    setSelectedJourney(null);
    setDetailActive(false);
  };

  const appendJourney = (journey: RawJourney): void => {
    const newProcessedJourney = processJourneys([journey]);

    setJourneys((currentState) => [...currentState, ...newProcessedJourney]);
  };

  const removeJourney = (targetJourney: ProcessedJourney) => {
    setJourneys((currentState) =>
      currentState.filter((journey) => journey.id !== targetJourney.id)
    );
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
          {
            type: "block",
            textContent: "기록 남기기",
            handler: toggleJourneyForm,
          },
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
          onDeleteJourney={removeJourney}
        ></JourneyDetail>

        <JourneyForm
          isActive={isFormActive}
          onCloseForm={toggleJourneyForm}
          onContentAdded={appendJourney}
        ></JourneyForm>
      </div>
    </div>
  );
}

export default JourneyExplorer;
