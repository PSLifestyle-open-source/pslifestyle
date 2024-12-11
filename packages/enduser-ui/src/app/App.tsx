import HeaderWithMenu from "../common/components/layout/header/HeaderWithMenu";
import { FullPageLoader } from "../common/components/loaders/FullPageLoader";
import { injectStore as injectApiStore } from "../firebase/api/utils";
import { initI18Next } from "../i18n/config";
import { AppRoutes } from "./AppRoutes";
import { Notifications } from "./Notifications";
import { Router } from "./Router";
import {
  initializeUserSession,
  injectStore as injectSessionStore,
} from "./session";
import { store, persistor } from "./store";
import { ReactElement, Suspense, useEffect } from "react";
import { Provider } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

declare global {
  interface Window {
    Cypress?: never;
    store: typeof store;
    cyNavigate: NavigateFunction;
  }
}

interface CypressSupportProps {
  store: typeof store;
}

const CypressSupport = ({ store }: CypressSupportProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.Cypress) {
      window.cyNavigate = navigate;
      window.store = store;
    }
  }, [navigate, store]);

  return null;
};

let initialized = false;

async function initialize() {
  if (!initialized) {
    initialized = true;
    initI18Next();
    injectApiStore(store);
    injectSessionStore(store);
    await initializeUserSession();
  }
}

export const App = (): ReactElement => (
  <Provider store={store}>
    <PersistGate
      loading={<FullPageLoader />}
      persistor={persistor}
      onBeforeLift={initialize}
    >
      <Suspense fallback={<FullPageLoader />}>
        <Router>
          <CypressSupport store={store} />
          <HeaderWithMenu />
          <Notifications />
          <AppRoutes />
        </Router>
      </Suspense>
    </PersistGate>
  </Provider>
);
