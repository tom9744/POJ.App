import React, { useState } from "react";
import "./App.scss";
import BubbleButton from "./components/BubbleButton/BubbleButton";
import Explorer from "./components/JourneyExplorer/JourneyExplorer";
import KakaoMap from "./components/KakaoMap/KakaoMap";

function App() {
  const [isOpenExplorer, setIsOpenExplorer] = useState<boolean>(false);

  const bubbleClickHandler = (_event: React.MouseEvent) => {
    setIsOpenExplorer(!isOpenExplorer);
  };

  return (
    <div className="app">
      <KakaoMap />

      <BubbleButton onBubbleClick={bubbleClickHandler} />

      <Explorer isOpen={isOpenExplorer} />
    </div>
  );
}

export default App;
