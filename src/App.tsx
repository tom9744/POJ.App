import React, {
  Dispatch,
  MouseEvent,
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import "./App.scss";
import BubbleButton from "./components/BubbleButton/BubbleButton";
import { RawPhoto } from "./components/JourneyExplorer/Journey.interface";
import JourneyExplorer from "./components/JourneyExplorer/JourneyExplorer";
import KakaoMap from "./components/KakaoMap/KakaoMap";
import { MarkerData } from "./components/KakaoMap/KakaoMapService";

type AppAction =
  | { type: "ACTIVATE_BUBBLE_BUTTON" }
  | { type: "ACTIVATE_EXPLORER" }
  | { type: "SET_SELECTED_PHOTO"; photo: RawPhoto };

type AppDispatcher = Dispatch<AppAction>;

interface AppState {
  isExplorerActive: boolean;
  isButtonActive: boolean;
  selectedPhoto: RawPhoto | null;
}

const INITIAL_APP_STATE = {
  isExplorerActive: false,
  isButtonActive: false,
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
  const [markerDataList, setMarkerDataList] = useState<MarkerData[]>([]);

  useEffect(() => {
    dispatch({ type: "ACTIVATE_BUBBLE_BUTTON" });
  }, []);

  const openExplorer = (_event: MouseEvent) => {
    dispatch({ type: "ACTIVATE_EXPLORER" });
  };

  const closeExplorer = (_event: MouseEvent) => {
    dispatch({ type: "ACTIVATE_BUBBLE_BUTTON" });
  };

  const extractLoactions = useCallback((photos: RawPhoto[]) => {
    const markerDataList: MarkerData[] = photos.map(
      ({ id, latitude, longitude, path }) => {
        return {
          id,
          coordinate: { longitude, latitude },
          path,
        };
      }
    );

    setMarkerDataList(markerDataList);
  }, []);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        <div className="app">
          <KakaoMap markerDataList={markerDataList} />

          <BubbleButton
            isActive={state.isButtonActive}
            onBubbleClick={openExplorer}
          />

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
