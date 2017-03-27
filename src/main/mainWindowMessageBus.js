import { SCENE_REMOVED } from './common/messageNames';
import globalEvents from './globalEvents';

export default (mainWindow) => {
  globalEvents.on('SCENE_REMOVED',
    args => mainWindow.webContents.send(SCENE_REMOVED, args)
  );
};
