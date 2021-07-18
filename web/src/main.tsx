import React from "react";
import ReactDOM from "react-dom";
import { configure, toJS, when } from "mobx";

import AppLoader from "./core/components/app-loader";

configure({
  enforceActions: "never",
});

const App = React.lazy(() => {
  return import("@web/core/firebase/data")
    .then(({ firebaseData }) =>
      when(() => typeof toJS(firebaseData.currentToast) !== "undefined")
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
