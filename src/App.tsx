import React, { Dispatch, MouseEvent, createContext, useEffect, useReducer } from "react";
import "./App.scss";
import BubbleButton from "./components/BubbleButton/BubbleButton";
import { ProcessedJourney, RawPhoto } from "./components/JourneyExplorer/Journey.interface";
import JourneyExplorer from "./components/JourneyExplorer/JourneyExplorer";
import KakaoMap from "./components/KakaoMap/KakaoMap";
import { MarkerData } from "./components/KakaoMap/KakaoMapService";

type AppAction =
  | { type: "ACTIVATE_BUBBLE_BUTTON" }
  | { type: "ACTIVATE_EXPLORER" }
  | { type: "SET_MARKER_LIST"; markerDataList: MarkerData[] }
  | { type: "SET_SELECTED_MARKER"; markerData: MarkerData | null }
  | { type: "SET_JOURNEY_LIST"; journeyList: ProcessedJourney[] }
  | { type: "APPEND_JOURNEY"; journey: ProcessedJourney }
  | { type: "DELETE_JOURNEY"; journey: ProcessedJourney }
  | { type: "APPEND_PHOTOS_TO_SELECTED_JOURNEY"; photos: RawPhoto[] }
  | { type: "DELETE_PHOTO_FROM_SELECTED_JOURNEY"; photo: RawPhoto }
  | { type: "SET_SELECTED_JOURNEY"; joureny: ProcessedJourney | null }
  | { type: "SET_SELECTED_PHOTO"; photo: RawPhoto | null };

type AppDispatcher = Dispatch<AppAction>;

interface AppState {
  isExplorerActive: boolean;
  isButtonActive: boolean;
  markerDataList: MarkerData[];
  selectedMarker: MarkerData | null;
  journeyList: ProcessedJourney[];
  selectedJourney: ProcessedJourney | null;
  selectedPhoto: RawPhoto | null;
}

const INITIAL_APP_STATE = {
  isExplorerActive: false,
  isButtonActive: false,
  markerDataList: [] as MarkerData[],
  selectedMarker: null,
  journeyList: [] as ProcessedJourney[],
  selectedJourney: null,
  selectedPhoto: null,
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
    case "SET_JOURNEY_LIST":
      return {
        ...state,
        journeyList: action.journeyList,
      };
    case "APPEND_JOURNEY":
      return {
        ...state,
        journeyList: [...state.journeyList, action.journey],
      };
    case "DELETE_JOURNEY":
      return {
        ...state,
        journeyList: state.journeyList.filter(({ id }) => id !== action.journey.id),
      };
    case "APPEND_PHOTOS_TO_SELECTED_JOURNEY":
      if (!state.selectedJourney) {
        return state;
      }

      return {
        ...state,
        journeyList: state.journeyList.map((journey) => {
          return state.selectedJourney?.id === journey.id
            ? { ...journey, photos: [...journey.photos, ...action.photos] }
            : journey;
        }),
        selectedJourney: { ...state.selectedJourney, photos: [...state.selectedJourney.photos, ...action.photos] },
      };
    case "DELETE_PHOTO_FROM_SELECTED_JOURNEY":
      if (!state.selectedJourney) {
        return state;
      }

      return {
        ...state,
        journeyList: state.journeyList.map((journey) => {
          return state.selectedJourney?.id === journey.id
            ? { ...journey, photos: journey.photos.filter((photo) => action.photo.id !== photo.id) }
            : journey;
        }),
        selectedJourney: {
          ...state.selectedJourney,
          photos: state.selectedJourney.photos.filter((photo) => action.photo.id !== photo.id),
        },
      };
    case "SET_SELECTED_JOURNEY":
      return {
        ...state,
        selectedJourney: action.joureny,
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

  useEffect(() => {
    if (state.selectedJourney) {
      const markerDataList = state.selectedJourney.photos.map(({ id, latitude, longitude, path }) => {
        return { id, coordinate: { longitude, latitude }, path };
      });

      dispatch({ type: "SET_MARKER_LIST", markerDataList });
    } else {
      dispatch({ type: "SET_MARKER_LIST", markerDataList: [] });
    }
  }, [state.selectedJourney]);

  const openExplorer = (_event: MouseEvent) => {
    dispatch({ type: "ACTIVATE_EXPLORER" });
  };

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        <div className="app">
          <KakaoMap markerDataList={state.markerDataList} selectedMarker={state.selectedMarker} />

          <BubbleButton isActive={state.isButtonActive} onBubbleClick={openExplorer} />

          <JourneyExplorer />
        </div>
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export default App;
