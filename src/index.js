import {
  serveAppServer,
  createAppServer,
  configurePersistentState,
  configureGuiEventsServer,
  configureGuiEventsMiddleware,
  serveGuiEventsServer,
  createGuiServer,
  serveGuiServer
} from './lib/app';

const APP_SERVER_PORT = 3060;
const GUI_SERVER_PORT = 3070;
const GUI_EVENTS_SERVER_PORT = 3061;
let persistentState;

export const startApp = (guiEventsMiddleware) => {
  persistentState = configurePersistentState();
  persistentState.restore();
  serveAppServer(createAppServer(guiEventsMiddleware), APP_SERVER_PORT);
};

export const startGUI = () => {
  const guiEventsServer = configureGuiEventsServer(persistentState);
  serveGuiEventsServer(guiEventsServer.server, GUI_EVENTS_SERVER_PORT);
  const guiEventsMiddleware = configureGuiEventsMiddleware(guiEventsServer);
  serveGuiServer(createGuiServer(), GUI_SERVER_PORT);

  return guiEventsMiddleware;
};
