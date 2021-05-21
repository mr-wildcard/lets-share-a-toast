import React from "react";
import ReactDOM from "react-dom";
import { configure } from "mobx";

import App from "./App";
import AppLoader from "@web/core/components/AppLoader";

configure({
  enforceActions: "never",
});

ReactDOM.render(
  <React.StrictMode>
    <AppLoader>
      <App />
    </AppLoader>
  </React.StrictMode>,
  document.getElementById("root")
);
