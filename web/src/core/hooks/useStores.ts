import { createContext, useContext } from "react";
import { configure } from "mobx";

import UI from "@web/core/stores/UI";

configure({
  enforceActions: "never",
});

const storesContext = createContext({
  ui: new UI(),
});

export default function useStores() {
  return useContext(storesContext);
}
