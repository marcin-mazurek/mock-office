import { DESCRIPTION_REMOVED } from './common/messageNames';
import globalEvents from './globalEvents';

export default (mainWindow) => {
  globalEvents.on('DESCRIPTION_REMOVED',
    args => mainWindow.webContents.send(DESCRIPTION_REMOVED, args)
  );
};
