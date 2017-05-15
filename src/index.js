import commandLineArgs from 'command-line-args';
import { serveAppServer, createAppServer } from './app/appServer/appServer';
import configurePersistentState from './app/createPersistentState';
import { configureGuiEventsServer, serveGuiEventsServer } from './app/guiEventsServer';
import ServersManager from './app/serversManager';
import { createGuiServer, serveGuiServer } from './app/guiServer';

const APP_SERVER_PORT = 3060;
const GUI_SERVER_PORT = 3070;
const GUI_EVENTS_SERVER_PORT = 3061;
const serversManager = new ServersManager();
const persistentState = configurePersistentState(serversManager);
persistentState.restore();
serveAppServer(createAppServer(serversManager), APP_SERVER_PORT);

// Very simple command line arguments support
const options = commandLineArgs([
  {
    name: 'gui',
    type: Boolean
  }
]);

// Spawning GUI server
if (options.gui) {
  // eslint-disable-next-line global-require
  serveGuiEventsServer(
    configureGuiEventsServer(serversManager, persistentState), GUI_EVENTS_SERVER_PORT
  );
  serveGuiServer(createGuiServer(), GUI_SERVER_PORT);
}
