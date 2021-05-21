import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import AppLoader from "@web/core/components/AppLoader";

ReactDOM.render(
  <React.StrictMode>
    <AppLoader>
      <App />
    </AppLoader>
  </React.StrictMode>,
  document.getElementById("root")
);
