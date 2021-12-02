import React, { useCallback, useEffect, useReducer, useState } from "react";
import "./App.scss";
import BubbleButton from "./components/BubbleButton/BubbleButton";
import { RawPhoto } from "./components/JourneyExplorer/Journey.interface";
import JourneyExplorer from "./components/JourneyExplorer/JourneyExplorer";
import KakaoMap from "./components/KakaoMap/KakaoMap";
import { Coordinate, MarkerData } from "./components/KakaoMap/KakaoMapService";

interface UIAction {
  type: "ACTIVATE_BUBBLE_BUTTON" | "ACTIVATE_EXPLORER";
}

interface UIState {
  isExplorerActive: boolean;
  isButtonActive: boolean;
}

const reducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case "ACTIVATE_BUBBLE_BUTTON":
      return {
        isExplorerActive: false,
        isButtonActive: true,
      };
    case "ACTIVATE_EXPLORER":
      return {
        isExplorerActive: true,
        isButtonActive: false,
      };
    default:
      throw new Error("[App] Invalid action type has been dispatched.");
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, {
    isExplorerActive: false,
    isButtonActive: false,
  });
  const [markerDataList, setMarkerDataList] = useState<MarkerData[]>([]);

  useEffect(() => {
    dispatch({ type: "ACTIVATE_BUBBLE_BUTTON" });
  }, []);

  const openExplorer = (_event: React.MouseEvent) => {
    dispatch({ type: "ACTIVATE_EXPLORER" });
  };

  const closeExplorer = (_event: React.MouseEvent) => {
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
  );
}

export default App;
