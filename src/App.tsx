import React, { useEffect, useReducer } from "react";
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

function App() {
  const [state, dispatch] = useReducer(reducer, {
    isExplorerActive: false,
    isButtonActive: false,
  });

  useEffect(() => {
    dispatch({ type: "ACTIVATE_BUBBLE_BUTTON" });
  }, []);

  const openExplorer = (_event: React.MouseEvent) => {
    dispatch({ type: "ACTIVATE_EXPLORER" });
  };

  const closeExplorer = (_event: React.MouseEvent) => {
    dispatch({ type: "ACTIVATE_BUBBLE_BUTTON" });
  };

  return (
    <div className="app">
      <KakaoMap />

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
