import { serveAppServer, createAppServer } from './lib/app/appServer/appServer';
import configurePersistentState from './lib/app/createPersistentState';
import { configureGuiEventsServer, serveGuiEventsServer } from './lib/app/guiEventsServer';
import ServersManager from './lib/app/serversManager';
import { createGuiServer, serveGuiServer } from './lib/app/guiServer';

const APP_SERVER_PORT = 3060;
const GUI_SERVER_PORT = 3070;
const GUI_EVENTS_SERVER_PORT = 3061;
let serversManager;
let persistentState;

export const startApp = () => {
  serversManager = new ServersManager();
  persistentState = configurePersistentState(serversManager);
  persistentState.restore();
  serveAppServer(createAppServer(serversManager), APP_SERVER_PORT);
};

export const startGUI = () => {
  // eslint-disable-next-line global-require
  serveGuiEventsServer(
    configureGuiEventsServer(serversManager, persistentState), GUI_EVENTS_SERVER_PORT
  );
  serveGuiServer(createGuiServer(), GUI_SERVER_PORT);
};
