import "./MobileApp.scss";
import { useMobileAppState } from "./MobileAppProvider";
import Passcode from "./pages/Passcode/Passcode";
import Header from "./components/UI/Header/Header";
import JourneyList from "./pages/JourneyList/JourneyList";
import Footer from "./components/UI/Footer/Footer";
import React from "react";

function MobileApp() {
  const state = useMobileAppState();

  return (
    <main className="mobile-app">
      {state.isAuthorized ? (
        <React.Fragment>
          <Header></Header>
          <JourneyList></JourneyList>
          <Footer></Footer>
        </React.Fragment>
      ) : (
        <Passcode></Passcode>
      )}
    </main>
  );
}

export default MobileApp;
