import "./MobileApp.scss";
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useMobileAppState } from "./MobileAppProvider";
import Passcode from "./pages/Passcode/Passcode";
import Header from "./components/UI/Header/Header";
import JourneyList from "./pages/JourneyList/JourneyList";
import JourneyForm from "./pages/JourneyForm/JourneyForm";

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
      <Routes>
        <Route path="/" element={<JourneyList></JourneyList>}></Route>
        <Route path="/form" element={<JourneyForm></JourneyForm>}></Route>
        <Route path="/auth" element={<Passcode></Passcode>}></Route>
      </Routes>
    </main>
  );
}

export default MobileApp;
