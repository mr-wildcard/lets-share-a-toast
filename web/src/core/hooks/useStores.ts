import { createContext, useContext } from "react";
import { configure } from "mobx";

import UI from "@web/core/stores/UI";
import Auth from "@web/core/stores/Auth";
import Voting from "@web/core/stores/Voting";
import Notifications from "@web/core/stores/Notifications";
import AppLoader from "@web/core/stores/AppLoader";
import CurrentToastSession from "@web/core/stores/CurrentToastSession";

configure({
  enforceActions: "never",
});

const storesContext = createContext({
  auth: new Auth(),
  ui: new UI(),
  voting: new Voting(),
  notifications: new Notifications(),
  appLoader: new AppLoader(),
  currentToastSession: new CurrentToastSession(),
});

export default function useStores() {
  return useContext(storesContext);
}
