import React from "react";
import { createRoot } from "react-dom/client";
import { configure } from "mobx";

import { AppLoader } from "./core/components/app-loader";
import App from "./App";

configure({
  enforceActions: "never",
});

const rootHTMLElement = document.getElementById("root");

if (rootHTMLElement) {
  const root = createRoot(rootHTMLElement);

  root.render(
    <React.StrictMode>
      <AppLoader>
        <App />
      </AppLoader>
    </React.StrictMode>
  );
}
