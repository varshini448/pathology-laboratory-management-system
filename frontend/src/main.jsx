import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/design/tokens.css";
import "./styles/design/app-shell.css";
import "./index.css";
import "./styles/consent/consent.css";
import "./styles/digital-pathology/digital-pathology.css";
import "./styles/common/common.css";
import "./styles/ui/reusable-ui.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);