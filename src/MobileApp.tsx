import "./MobileApp.scss";
import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useMobileAppState } from "./MobileAppProvider";
import Passcode from "./pages/Passcode/Passcode";
import JourneyList from "./pages/JourneyList/JourneyList";
import JourneyForm from "./pages/JourneyForm/JourneyForm";
import Journey from "./pages/Journey/Journey";

function MobileApp() {
  const appState = useMobileAppState();
  const navigate = useNavigate();

  // NOTE: Router Guard
  useEffect(() => {
    if (!appState.isAuthorized) {
      navigate("/auth", { replace: true });
    }
  }, [appState, navigate]);

  return (
    <main className="mobile-app">
      <Routes>
        <Route path="/" element={<Navigate replace to="/journeys"></Navigate>}></Route>
        <Route path="journeys" element={<JourneyList></JourneyList>}></Route>
        <Route path="journeys/:jourenyId" element={<Journey></Journey>}></Route>
        <Route path="form" element={<JourneyForm></JourneyForm>}></Route>
        <Route path="auth" element={<Passcode></Passcode>}></Route>
      </Routes>
    </main>
  );
}

export default MobileApp;
