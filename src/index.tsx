import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import MobileApp from "./MobileApp";
import { MobileAppProvider } from "./MobileAppProvider";

ReactDOM.render(
  <MobileAppProvider>
    <MobileApp />
  </MobileAppProvider>,
  document.getElementById("root")
);
