import { createContext, useContext } from 'react';
import { configure } from 'mobx';
import { enableStaticRendering } from 'mobx-react-lite';

import UI from 'frontend/core/stores/UI';
import Auth from 'frontend/core/stores/Auth';
import Voting from 'frontend/core/stores/Voting';
import Notifications from 'frontend/core/stores/Notifications';
import AppLoader from 'frontend/core/stores/AppLoader';
import CurrentToastSession from 'frontend/core/stores/CurrentToastSession';

enableStaticRendering(!process.browser);

configure({
  enforceActions: 'never',
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
