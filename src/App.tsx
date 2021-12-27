import React, { Dispatch, MouseEvent, createContext, useCallback, useEffect, useReducer, useState } from "react";
import "./App.scss";
import BubbleButton from "./components/BubbleButton/BubbleButton";
import { RawPhoto } from "./components/JourneyExplorer/Journey.interface";
import JourneyExplorer from "./components/JourneyExplorer/JourneyExplorer";
import KakaoMap from "./components/KakaoMap/KakaoMap";
import { MarkerData } from "./components/KakaoMap/KakaoMapService";

type AppAction =
  | { type: "ACTIVATE_BUBBLE_BUTTON" }
  | { type: "ACTIVATE_EXPLORER" }
  | { type: "SET_MARKER_LIST"; markerDataList: MarkerData[] }
  | { type: "SET_SELECTED_MARKER"; markerData: MarkerData | null }
  | { type: "SET_SELECTED_PHOTO"; photo: RawPhoto | null };

type AppDispatcher = Dispatch<AppAction>;

interface AppState {
  isExplorerActive: boolean;
  isButtonActive: boolean;
  markerDataList: MarkerData[];
  selectedMarker: MarkerData | null;
  selectedPhoto: RawPhoto | null;
}

const INITIAL_APP_STATE = {
  isExplorerActive: false,
  isButtonActive: false,
  markerDataList: [] as MarkerData[],
  selectedPhoto: null,
  selectedMarker: null,
};

export const AppStateContext = createContext<AppState>(INITIAL_APP_STATE);
export const AppDispatchContext = createContext<AppDispatcher>(() => null);

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "ACTIVATE_BUBBLE_BUTTON":
      return {
        ...state,
        isExplorerActive: false,
        isButtonActive: true,
      };
    case "ACTIVATE_EXPLORER":
      return {
        ...state,
        isExplorerActive: true,
        isButtonActive: false,
      };
    case "SET_MARKER_LIST":
      return {
        ...state,
        markerDataList: action.markerDataList,
      };
    case "SET_SELECTED_MARKER":
      return {
        ...state,
        selectedMarker: action.markerData,
      };
    case "SET_SELECTED_PHOTO":
      return {
        ...state,
        selectedPhoto: action.photo,
      };
    default:
      throw new Error("[App] Invalid action type has been dispatched.");
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL_APP_STATE);

  useEffect(() => {
    dispatch({ type: "ACTIVATE_BUBBLE_BUTTON" });
  }, []);

  useEffect(() => {
    if (!state.selectedPhoto || !state.markerDataList) return;

    const markerData = state.markerDataList.find(({ id }) => id === state.selectedPhoto?.id);

    if (markerData) {
      dispatch({ type: "SET_SELECTED_MARKER", markerData });
    }
  }, [state.markerDataList, state.selectedPhoto]);

  const openExplorer = (_event: MouseEvent) => {
    dispatch({ type: "ACTIVATE_EXPLORER" });
  };

  const closeExplorer = (_event: MouseEvent) => {
    dispatch({ type: "ACTIVATE_BUBBLE_BUTTON" });
  };

  const extractLoactions = useCallback((photos: RawPhoto[]) => {
    const markerDataList: MarkerData[] = photos.map(({ id, latitude, longitude, path }) => {
      return {
        id,
        coordinate: { longitude, latitude },
        path,
      };
    });

    dispatch({ type: "SET_MARKER_LIST", markerDataList });
  }, []);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        <div className="app">
          <KakaoMap markerDataList={state.markerDataList} selectedMarker={state.selectedMarker} />

          <BubbleButton isActive={state.isButtonActive} onBubbleClick={openExplorer} />

          <JourneyExplorer
            isActive={state.isExplorerActive}
            onSelectJourney={extractLoactions}
            onCloseExplorer={closeExplorer}
          />
        </div>
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export default App;
