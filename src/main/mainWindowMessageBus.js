import globalEvents from './double/globalEvents';

export default (mainWindow) => {
  globalEvents.on('SCENE_REMOVED',
    args => mainWindow.webContents.send('SCENE_REMOVED', args)
  );

  globalEvents.on('SCENE_START',
    args => mainWindow.webContents.send('SCENE_START', args)
  );

  globalEvents.on('SCENE_END',
    args => mainWindow.webContents.send('SCENE_END', args)
  );

  globalEvents.on('SCENE_CANCEL',
    args => mainWindow.webContents.send('SCENE_CANCEL', args)
  );

  globalEvents.on('SCENE_REMOVED_AFTER_USE',
    args => mainWindow.webContents.send('SCENE_REMOVED_AFTER_USE', args)
  );

  globalEvents.on('SCENE_PART_START',
    args => mainWindow.webContents.send('SCENE_PART_START', args)
  );

  globalEvents.on('SCENE_PART_END',
    args => mainWindow.webContents.send('SCENE_PART_END', args)
  );

  globalEvents.on('SCENE_PART_CANCEL',
    args => mainWindow.webContents.send('SCENE_PART_CANCEL', args)
  );

  globalEvents.on('RESTORE_STATE',
    () => mainWindow.webContents.send('RESTORE_STATE')
  );
};
