import React, { useEffect, useReducer, useState } from "react";
import "./App.scss";
import BubbleButton from "./components/BubbleButton/BubbleButton";
import JourneyExplorer from "./components/JourneyExplorer/JourneyExplorer";
import KakaoMap from "./components/KakaoMap/KakaoMap";

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
      throw new Error("Invalid action type has been dispatched.");
  }
};

const arrayGenerator = (): any[] => {
  const randomLength = Math.floor(Math.random() * 10);

  return Array(randomLength).fill(null);
};

function App() {
  const [state, dispatch] = useReducer(reducer, {
    isExplorerActive: false,
    isButtonActive: false,
  });
  const [locations, setLocations] = useState<number[]>([]);

  useEffect(() => {
    dispatch({ type: "ACTIVATE_BUBBLE_BUTTON" });

    setInterval(() => {
      const filledArray = arrayGenerator().map((_, index) => index);
      setLocations(filledArray);
    }, 500);
  }, []);

  const openExplorer = (_event: React.MouseEvent) => {
    dispatch({ type: "ACTIVATE_EXPLORER" });
  };

  const closeExplorer = (_event: React.MouseEvent) => {
    dispatch({ type: "ACTIVATE_BUBBLE_BUTTON" });
  };

  return (
    <div className="app">
      <KakaoMap locations={locations} />

      <BubbleButton
        isActive={state.isButtonActive}
        onBubbleClick={openExplorer}
      />

      <JourneyExplorer
        isActive={state.isExplorerActive}
        onCloseExplorer={closeExplorer}
      />
    </div>
  );
}

export default App;
