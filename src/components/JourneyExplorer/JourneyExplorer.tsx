import React, { useCallback, useContext, useEffect, useReducer } from "react";
import JourneyForm from "./JourneyForm/JourneyForm";
import classes from "./JourneyExplorer.module.scss";

import JourneyList from "./JourneyList/JourneyList";
import JourneyDetail from "./JourneyDetail/JourneyDetail";
import ExplorerHeader from "./Layouts/ExplorerHeader/ExplorerHeader";
import { modifyImagePath, processJourneys } from "./JourneyService";
import { RawJourney, ProcessedJourney, RawPhoto } from "./Journey.interface";
import useHttp from "../../hooks/useHttp";
import { AppDispatchContext, AppStateContext } from "../../App";

type ExplorerAction = { type: "TOGGLE_JOURNEY_FORM" } | { type: "SET_SHOW_JOURNEY_DETAIL"; props: boolean };

interface ExplorerState {
  showJourneyForm: boolean;
  showJourneyDatail: boolean;
}

const reducer = (state: ExplorerState, action: ExplorerAction): ExplorerState => {
  switch (action.type) {
    case "TOGGLE_JOURNEY_FORM":
      return { ...state, showJourneyForm: !state.showJourneyForm };
    case "SET_SHOW_JOURNEY_DETAIL":
      return { ...state, showJourneyDatail: action.props };
    default:
      throw new Error("[JourneyExplorer] Invalid action type has been dispatched.");
  }
};

function JourneyExplorer() {
  const appState = useContext(AppStateContext);
  const appDispatch = useContext(AppDispatchContext);
  const [state, dispatch] = useReducer(reducer, {
    showJourneyForm: false,
    showJourneyDatail: false,
  });
  const { requestState, sendRequest: fetchJourneys } = useHttp<RawJourney[]>();

  // NOTE: Cannot use async/await in useEffect Hook.
  useEffect((): void => {
    if (!appState.isExplorerActive) return;

    fetchJourneys({ url: "http://localhost:3030/journeys" })
      .then((journeys) => {
        appDispatch({ type: "SET_JOURNEY_LIST", journeyList: processJourneys(journeys) });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [appState.isExplorerActive, fetchJourneys, appDispatch]);

  const closeExplorer = useCallback(() => {
    appDispatch({ type: "ACTIVATE_BUBBLE_BUTTON" });
  }, [appDispatch]);

  const toggleJourneyForm = (): void => {
    dispatch({ type: "TOGGLE_JOURNEY_FORM" });
  };

  const openDetail = (index: number): void => {
    dispatch({ type: "SET_SHOW_JOURNEY_DETAIL", props: true });
    appDispatch({ type: "SET_SELECTED_JOURNEY", joureny: appState.journeyList[index] });
  };

  const closeDetail = (): void => {
    dispatch({ type: "SET_SHOW_JOURNEY_DETAIL", props: false });
    appDispatch({ type: "SET_SELECTED_JOURNEY", joureny: null });
  };

  const appendJourney = (journey: RawJourney): void => {
    appDispatch({ type: "SET_JOURNEY_LIST", journeyList: processJourneys([...appState.journeyList, journey]) });
  };

  const removeJourney = (journey: ProcessedJourney): void => {
    appDispatch({ type: "DELETE_JOURNEY", journey });
  };

  const appendPhotos = (photos: RawPhoto[]): void => {
    if (!appState.selectedJourney) return;

    appDispatch({ type: "APPEND_PHOTOS_TO_SELECTED_JOURNEY", photos: modifyImagePath(photos) });
  };

  const removePhoto = (photo: RawPhoto): void => {
    if (!appState.selectedJourney) return;

    appDispatch({ type: "DELETE_PHOTO_FROM_SELECTED_JOURNEY", photo });
  };

  return (
    <div className={`${classes["explorer-wrapper"]} ${appState.isExplorerActive ? classes.active : classes.deactive}`}>
      <ExplorerHeader
        close
        onClose={closeExplorer}
        leftButtons={[
          {
            type: "block",
            textContent: "기록 남기기",
            isDisabled: requestState.showError || requestState.showLoading,
            handler: toggleJourneyForm,
          },
        ]}
      ></ExplorerHeader>

      {requestState.showLoading && <div className={classes.loading}>불러오는 중...</div>}

      {requestState.showError && <div className={classes.error}>{requestState.errorMessage}</div>}

      {!requestState.showLoading && !requestState.showError && (
        <JourneyList journeys={appState.journeyList} onSelectJourney={openDetail}></JourneyList>
      )}

      <div className={classes["component-slot"]}>
        <JourneyDetail
          isActive={state.showJourneyDatail}
          journey={appState.selectedJourney}
          onCloseDetail={closeDetail}
          onDeleteJourney={removeJourney}
          onUploadPhotos={appendPhotos}
          onDeletePhoto={removePhoto}
        ></JourneyDetail>

        <JourneyForm
          isActive={state.showJourneyForm}
          onCloseForm={toggleJourneyForm}
          onContentAdded={appendJourney}
        ></JourneyForm>
      </div>
    </div>
  );
}

export default JourneyExplorer;
