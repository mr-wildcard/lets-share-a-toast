import React from "react";
import ReactDOM from "react-dom";
import { configure, when } from "mobx";

import AppLoader from "./core/components/app-loader";

configure({
  enforceActions: "never",
});

const App = React.lazy(() => {
  return import("@web/core/firebase/data")
    .then(({ firebaseData }) =>
      Promise.all([
        when(() => firebaseData.currentToastExists),
        when(() => firebaseData.votingSessionExists),
      ])
    )
    .then(() => import("./App"));
});

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={<AppLoader />}>
      <App />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);
