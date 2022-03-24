import React from "react";
import "./MobileApp.scss";
import Passcode from "./pages/Passcode/Passcode";
import Header from "./components/UI/Header/Header";
import { useMobileAppState } from "./MobileAppProvider";
import JourneyList from "./pages/JourneyList/JourneyList";

function MobileApp() {
  const state = useMobileAppState();

  return (
    <main className="mobile-app">
      <Header></Header>
      {state.isAuthorized ? <JourneyList></JourneyList> : <Passcode></Passcode>}
    </main>
  );
}

export default MobileApp;
