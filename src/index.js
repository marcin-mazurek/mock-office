import {
  serveAppServer,
  createAppServer,
  configurePersistentState,
  configureGuiEventsServer,
  serveGuiEventsServer
} from './lib/app';
import { createGuiServer, serveGuiServer } from './lib/app/guiServer';

const APP_SERVER_PORT = 3060;
const GUI_SERVER_PORT = 3070;
const GUI_EVENTS_SERVER_PORT = 3061;
let persistentState;

export const startApp = () => {
  persistentState = configurePersistentState();
  persistentState.restore();
  serveAppServer(createAppServer(), APP_SERVER_PORT);
};

export const startGUI = () => {
  serveGuiEventsServer(
    configureGuiEventsServer(persistentState), GUI_EVENTS_SERVER_PORT
  );
  serveGuiServer(createGuiServer(), GUI_SERVER_PORT);
};
