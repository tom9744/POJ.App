import React, { useEffect, useState } from "react";
import "./App.scss";
import BubbleButton from "./components/BubbleButton/BubbleButton";
import JourneyExplorer from "./components/JourneyExplorer/JourneyExplorer";
import KakaoMap from "./components/KakaoMap/KakaoMap";

function App() {
  const [isExplorerActive, setExplorerActive] = useState<boolean>(false);
  const [isButtonActive, setButtonActive] = useState<boolean>(false);

  useEffect(() => {
    setButtonActive(true);
  }, []);

  const openExplorer = (_event: React.MouseEvent) => {
    setExplorerActive(true);
    setButtonActive(false);
  };

  const closeExplorer = (_event: React.MouseEvent) => {
    setExplorerActive(false);
    setButtonActive(true);
  };

  return (
    <div className="app">
      <KakaoMap />

      <BubbleButton isActive={isButtonActive} onBubbleClick={openExplorer} />

      <JourneyExplorer
        isActive={isExplorerActive}
        onCloseExplorer={closeExplorer}
      />
    </div>
  );
}

export default App;
