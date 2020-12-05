import { createContext, useContext } from 'react';
import { useStaticRendering } from 'mobx-react-lite';

import UI from 'frontend/core/stores/UI';
import Auth from 'frontend/core/stores/Auth';
import Voting from 'frontend/core/stores/Voting';
import Notifications from 'frontend/core/stores/Notifications';
import AppLoading from 'frontend/core/stores/AppLoading';

// eslint-disable-next-line react-hooks/rules-of-hooks
useStaticRendering(!process.browser);

const storesContext = createContext({
  auth: new Auth(),
  ui: new UI(),
  voting: new Voting(),
  notifications: new Notifications(),
  appLoading: new AppLoading(),
});

export default function useStores() {
  return useContext(storesContext);
}
