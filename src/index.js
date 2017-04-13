import commandLineArgs from 'command-line-args';
import { serveAppServer, createAppServer } from './appServer';
import createPersistentState from './createPersistentState';
import createGuiEventsServer from './createGuiEventsServer';
import ServersManager from './servers-manager';
import { createGuiServer, serveGuiServer } from './guiServer';

const serversManager = new ServersManager();
const persistentState = createPersistentState(serversManager);
persistentState.restore();
serveAppServer(createAppServer(serversManager));

const options = commandLineArgs([
  {
    name: 'gui',
    type: Boolean
  }
]);

if (options.gui) {
  // eslint-disable-next-line global-require
  const guiEventsServer = createGuiEventsServer(serversManager, persistentState);
  guiEventsServer.start(3061);
  serveGuiServer(createGuiServer());
}
