import React from "react";
import ReactDOM from "react-dom";
import { configure } from "mobx";

import { AppLoader } from "./core/components/app-loader";
import App from "./App";

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
