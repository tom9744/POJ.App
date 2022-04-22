import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import MobileApp from "./MobileApp";
import { MobileAppProvider } from "./MobileAppProvider";

ReactDOM.render(
  <BrowserRouter>
    <MobileAppProvider>
      <MobileApp />
    </MobileAppProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
