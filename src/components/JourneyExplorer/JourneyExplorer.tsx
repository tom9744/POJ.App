import React, { useContext, useEffect, useReducer } from "react";
import JourneyForm from "./JourneyForm/JourneyForm";
import classes from "./JourneyExplorer.module.scss";

import JourneyList from "./JourneyList/JourneyList";
import JourneyDetail from "./JourneyDetail/JourneyDetail";
import ExplorerHeader from "./Layouts/ExplorerHeader/ExplorerHeader";
import { modifyImagePath, processJourneys } from "./JourneyService";
import { RawJourney, ProcessedJourney, RawPhoto } from "./Journey.interface";
import useHttp from "../../hooks/useHttp";
import { AppDispatchContext, AppStateContext } from "../../App";

type JourneyExplorerProps = {
  isActive: boolean;
  onCloseExplorer: (event: React.MouseEvent) => void;
};

type ExplorerAction =
  | { type: "TOGGLE_JOURNEY_FORM" }
  | { type: "SET_SHOW_JOURNEY_DETAIL"; props: boolean }
  | { type: "FETCH_JOURNEY"; props: ProcessedJourney[] }
  | { type: "APPEND_JOURNEY"; props: ProcessedJourney[] }
  | { type: "DELETE_JOURNEY"; props: ProcessedJourney }
  | {
      type: "UPDATE_PHOTO_LIST";
      props: { journeyId: number; photos: RawPhoto[] };
    };

interface ExplorerState {
  showJourneyForm: boolean;
  showJourneyDatail: boolean;
  journeys: ProcessedJourney[];
}

const reducer = (state: ExplorerState, action: ExplorerAction): ExplorerState => {
  switch (action.type) {
    case "TOGGLE_JOURNEY_FORM":
      return { ...state, showJourneyForm: !state.showJourneyForm };
    case "SET_SHOW_JOURNEY_DETAIL":
      return { ...state, showJourneyDatail: action.props };
    case "FETCH_JOURNEY":
      return { ...state, journeys: action.props };
    case "DELETE_JOURNEY":
      return {
        ...state,
        journeys: state.journeys.filter((journey) => journey.id !== action.props.id),
      };
    case "APPEND_JOURNEY":
      return { ...state, journeys: [...state.journeys, ...action.props] };
    case "UPDATE_PHOTO_LIST":
      return {
        ...state,
        journeys: [
          ...state.journeys.map((journey) => {
            if (action.props.journeyId === journey.id) {
              journey.photos = action.props.photos;
            }
            return journey;
          }),
        ],
      };
    default:
      throw new Error("[JourneyExplorer] Invalid action type has been dispatched.");
  }
};

function JourneyExplorer(props: JourneyExplorerProps) {
  const appState = useContext(AppStateContext);
  const appDispatch = useContext(AppDispatchContext);
  const [state, dispatch] = useReducer(reducer, {
    showJourneyForm: false,
    showJourneyDatail: false,
    journeys: [],
  });
  const { requestState, sendRequest: fetchJourneys } = useHttp<RawJourney[]>();

  // NOTE: Cannot use async/await in useEffect Hook.
  useEffect((): void => {
    if (!props.isActive) return;

    fetchJourneys({ url: "http://localhost:3030/journeys" })
      .then((journeys) => {
        dispatch({ type: "FETCH_JOURNEY", props: processJourneys(journeys) });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [props.isActive, fetchJourneys]);

  const toggleJourneyForm = (): void => {
    dispatch({ type: "TOGGLE_JOURNEY_FORM" });
  };

  const openDetail = (index: number): void => {
    dispatch({ type: "SET_SHOW_JOURNEY_DETAIL", props: true });
    appDispatch({ type: "SET_SELECTED_JOURNEY", joureny: state.journeys[index] });
  };

  const closeDetail = (): void => {
    dispatch({ type: "SET_SHOW_JOURNEY_DETAIL", props: false });
    appDispatch({ type: "SET_SELECTED_JOURNEY", joureny: null });
  };

  const appendJourney = (journey: RawJourney): void => {
    dispatch({ type: "APPEND_JOURNEY", props: processJourneys([journey]) });
  };

  const removeJourney = (targetJourney: ProcessedJourney): void => {
    dispatch({ type: "DELETE_JOURNEY", props: targetJourney });
  };

  const appendPhotos = (photos: RawPhoto[]): void => {
    if (!appState.selectedJourney) {
      return;
    }
    const { id, photos: prevPhotos } = appState.selectedJourney;

    dispatch({
      type: "UPDATE_PHOTO_LIST",
      props: {
        journeyId: id,
        photos: [...prevPhotos, ...modifyImagePath(photos)],
      },
    });
  };

  const removePhoto = (photo: RawPhoto): void => {
    if (!appState.selectedJourney) {
      return;
    }
    const { id, photos: prevPhotos } = appState.selectedJourney;

    dispatch({
      type: "UPDATE_PHOTO_LIST",
      props: {
        journeyId: id,
        photos: prevPhotos.filter(({ id }) => id !== photo.id),
      },
    });
  };

  return (
    <div className={`${classes["explorer-wrapper"]} ${props.isActive ? classes.active : classes.deactive}`}>
      <ExplorerHeader
        close
        onClose={props.onCloseExplorer}
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
        <JourneyList journeys={state.journeys} onSelectJourney={openDetail}></JourneyList>
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
