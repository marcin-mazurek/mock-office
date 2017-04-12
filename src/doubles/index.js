import commandLineArgs from 'command-line-args';
import { serveAppServer, configureAppServer } from './appServer';
import configurePersistentState from './configurePersistentState';
import createGuiEventsServer from './createGuiEventsServer';
import ServersManager from './servers-manager';
import { configureGuiServer, serveGuiServer } from './guiServer';

const serversManager = new ServersManager();
const persistentState = configurePersistentState(serversManager);
persistentState.restore();
serveAppServer(configureAppServer(serversManager));

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
  serveGuiServer(configureGuiServer());
}
