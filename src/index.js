import commandLineArgs from 'command-line-args';
import { serveAppServer, createAppServer } from './appServer';
import createPersistentState from './createPersistentState';
import { configureGuiEventsServer, serveGuiEventsServer } from './guiEventsServer';
import ServersManager from './servers-manager';
import { createGuiServer, serveGuiServer } from './guiServer';

const APP_SERVER_PORT = 3060;
const GUI_SERVER_PORT = 3070;
const GUI_EVENTS_SERVER_PORT = 3061;
const serversManager = new ServersManager();
const persistentState = createPersistentState(serversManager);
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
