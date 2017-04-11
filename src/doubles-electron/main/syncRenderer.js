import { addListener } from '../servers-manager/emitter';

export default (mainWindow) => {
  addListener('SCENE_REMOVED',
    args => mainWindow.webContents.send('SCENE_REMOVED', args)
  );

  addListener('SCENE_START',
    args => mainWindow.webContents.send('SCENE_START', args)
  );

  addListener('SCENE_END',
    args => mainWindow.webContents.send('SCENE_END', args)
  );

  addListener('SCENE_CANCEL',
    args => mainWindow.webContents.send('SCENE_CANCEL', args)
  );

  addListener('SCENE_REMOVED_AFTER_USE',
    args => mainWindow.webContents.send('SCENE_REMOVED_AFTER_USE', args)
  );

  addListener('SCENE_PART_START',
    args => mainWindow.webContents.send('SCENE_PART_START', args)
  );

  addListener('SCENE_PART_END',
    args => mainWindow.webContents.send('SCENE_PART_END', args)
  );

  addListener('SCENE_PART_CANCEL',
    args => mainWindow.webContents.send('SCENE_PART_CANCEL', args)
  );

  addListener('RESTORE_STATE',
    () => mainWindow.webContents.send('RESTORE_STATE')
  );
};
