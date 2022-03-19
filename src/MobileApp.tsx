import React from "react";
import "./MobileApp.scss";
import Passcode from "./components/Passcode/Passcode";
import Header from "./components/UI/Header/Header";
import { useMobileAppState } from "./MobileAppProvider";

function MobileApp() {
  const state = useMobileAppState();

  return (
    <main className="mobile-app">
      <Header></Header>
      {state.isAuthorized ? <article></article> : <Passcode></Passcode>}
    </main>
  );
}

export default MobileApp;
