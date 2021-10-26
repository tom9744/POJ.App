import React from "react";
import styles from "./App.module.css";
import KakaoMap from "./layouts/KakaoMap/KakaoMap";

function App() {
  return (
    <div className={styles.app}>
      <KakaoMap />
    </div>
  );
}

export default App;
