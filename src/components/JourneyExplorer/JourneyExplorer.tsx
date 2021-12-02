import React, { useEffect, useReducer, useState } from "react";
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

type ExplorerAction =
  | { type: "TOGGLE_JOURNEY_FORM" }
  | { type: "SET_SHOW_JOURNEY_DETAIL"; props: boolean }
  | { type: "SET_SHOW_LOADING"; props: boolean }
  | {
      type: "SET_SHOW_ERROR";
      props: { isError: boolean; errorMessage: string };
    }
  | { type: "FETCH_JOURNEY"; props: ProcessedJourney[] }
  | { type: "APPEND_JOURNEY"; props: ProcessedJourney[] }
  | { type: "DELETE_JOURNEY"; props: ProcessedJourney }
  | { type: "SELECT_JOURNEY"; props: ProcessedJourney | null };

interface ExplorerState {
  showJourneyForm: boolean;
  showJourneyDatail: boolean;
  showError: boolean;
  showLoading: boolean;
  journeys: ProcessedJourney[];
  selectedJourney: ProcessedJourney | null;
  errorMessage: string;
}

const reducer = (
  state: ExplorerState,
  action: ExplorerAction
): ExplorerState => {
  switch (action.type) {
    case "TOGGLE_JOURNEY_FORM":
      return { ...state, showJourneyForm: !state.showJourneyForm };
    case "SET_SHOW_JOURNEY_DETAIL":
      return { ...state, showJourneyDatail: action.props };
    case "SET_SHOW_LOADING":
      return { ...state, showLoading: action.props };
    case "SET_SHOW_ERROR":
      return {
        ...state,
        showError: action.props.isError,
        errorMessage: action.props.errorMessage,
      };
    case "FETCH_JOURNEY":
      return { ...state, journeys: action.props };
    case "DELETE_JOURNEY":
      return {
        ...state,
        journeys: state.journeys.filter(
          (journey) => journey.id !== action.props.id
        ),
      };
    case "APPEND_JOURNEY":
      return { ...state, journeys: [...state.journeys, ...action.props] };
    case "SELECT_JOURNEY":
      return { ...state, selectedJourney: action.props };
    default:
      throw new Error(
        "[JourneyExplorer] Invalid action type has been dispatched."
      );
  }
};

function JourneyExplorer(props: JourneyExplorerProps) {
  const [state, dispatch] = useReducer(reducer, {
    showJourneyForm: false,
    showJourneyDatail: false,
    showLoading: false,
    showError: false,
    journeys: [],
    selectedJourney: null,
    errorMessage: "",
  });

  // NOTE: Cannot use async/await in useEffect Hook.
  useEffect((): void => {
    if (!props.isActive) return;

    dispatch({ type: "SET_SHOW_LOADING", props: true });
    dispatch({
      type: "SET_SHOW_ERROR",
      props: { isError: false, errorMessage: "" },
    });

    fetchJourneys()
      .then((journeys) => {
        dispatch({ type: "FETCH_JOURNEY", props: processJourneys(journeys) });
      })
      .catch((error) => {
        dispatch({
          type: "SET_SHOW_ERROR",
          props: {
            isError: true,
            errorMessage:
              error instanceof HttpError
                ? "서버와 통신하는 도중에 오류가 발생했습니다."
                : "서버가 응답하지 않습니다. 잠시 후 다시 시도해주세요.",
          },
        });
      })
      .finally(() => {
        dispatch({ type: "SET_SHOW_LOADING", props: false });
      });
  }, [props.isActive]);

  const toggleJourneyForm = (): void => {
    dispatch({ type: "TOGGLE_JOURNEY_FORM" });
  };

  const openDetail = (index: number): void => {
    const selectedJourney = state.journeys[index];

    props.onSelectJourney(selectedJourney.photos);
    dispatch({ type: "SELECT_JOURNEY", props: selectedJourney });
    dispatch({ type: "SET_SHOW_JOURNEY_DETAIL", props: true });
  };

  const closeDetail = (): void => {
    dispatch({ type: "SELECT_JOURNEY", props: null });
    dispatch({ type: "SET_SHOW_JOURNEY_DETAIL", props: false });
  };

  const appendJourney = (journey: RawJourney): void => {
    dispatch({ type: "APPEND_JOURNEY", props: processJourneys([journey]) });
  };

  const removeJourney = (targetJourney: ProcessedJourney) => {
    dispatch({ type: "DELETE_JOURNEY", props: targetJourney });
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
            isDisabled: state.showError || state.showLoading,
            handler: toggleJourneyForm,
          },
        ]}
      ></ExplorerHeader>

      {state.showLoading && (
        <div className={classes.loading}>불러오는 중...</div>
      )}

      {state.showError && (
        <div className={classes.error}>{state.errorMessage}</div>
      )}

      <JourneyList
        journeys={state.journeys}
        onSelectJourney={openDetail}
      ></JourneyList>

      <div className={classes["component-slot"]}>
        <JourneyDetail
          isActive={state.showJourneyDatail}
          journey={state.selectedJourney}
          onCloseDetail={closeDetail}
          onDeleteJourney={removeJourney}
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
