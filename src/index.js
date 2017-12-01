import { serveAppServer } from './lib/app/appServer';
import { serveGuiServer } from './lib/app/gui/guiServer';
import { on } from './lib/app/eventLog';

const APP_SERVER_PORT = 3060;
const GUI_SERVER_PORT = 3070;

export const startApp = (plugins) => {
  plugins.forEach(p => p.start(on));
  serveAppServer(APP_SERVER_PORT);
};

export const startGUI = () => {
  serveGuiServer(GUI_SERVER_PORT);
};
