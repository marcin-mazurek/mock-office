import { serveAppServer } from './lib/app/appServer';
import { serveGuiServer, createGuiServer } from './lib/app/guiServer';
import ServersManager from './lib/app/ServersManager';

const APP_SERVER_PORT = 3060;
const GUI_SERVER_PORT = 3070;
const serversManager = new ServersManager();

export const startApp = (plugins) => {
  plugins.forEach(p => p.start(serversManager));
  serveAppServer(serversManager, APP_SERVER_PORT);
};

export const startGUI = () => {
  serveGuiServer(GUI_SERVER_PORT);
};
