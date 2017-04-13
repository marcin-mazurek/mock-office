import commandLineArgs from 'command-line-args';
import { serveAppServer, createAppServer } from './appServer';
import createPersistentState from './createPersistentState';
import createGuiEventsServer from './createGuiEventsServer';
import ServersManager from './servers-manager';
import { createGuiServer, serveGuiServer } from './guiServer';

const APP_SERVER_PORT = 3060;
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
  const guiEventsServer = createGuiEventsServer(serversManager, persistentState);
  guiEventsServer.start(3061);
  serveGuiServer(createGuiServer());
}
