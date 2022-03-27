import "./MobileApp.scss";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useMobileAppState } from "./MobileAppProvider";
import Passcode from "./pages/Passcode/Passcode";
import Header from "./components/UI/Header/Header";
import JourneyList from "./pages/JourneyList/JourneyList";
import Footer from "./components/UI/Footer/Footer";
import { useEffect } from "react";

function MobileApp() {
  const appState = useMobileAppState();
  const navigate = useNavigate();

  // NOTE: Router Guard
  useEffect(() => {
    if (!appState.isAuthorized) {
      navigate("/auth", { replace: true });
    }
  }, [appState]);

  return (
    <main className="mobile-app">
      <Header></Header>

      <Routes>
        <Route path="/" element={<JourneyList></JourneyList>}></Route>
        <Route path="/auth" element={<Passcode></Passcode>}></Route>
      </Routes>

      {appState.isAuthorized ? <Footer></Footer> : null}
    </main>
  );
}

export default MobileApp;
