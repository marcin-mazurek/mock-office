export default (mainWindow, emitter) => {
  emitter.on('SCENE_REMOVED',
    args => mainWindow.webContents.send('SCENE_REMOVED', args)
  );

  emitter.on('SCENE_START',
    args => mainWindow.webContents.send('SCENE_START', args)
  );

  emitter.on('SCENE_END',
    args => mainWindow.webContents.send('SCENE_END', args)
  );

  emitter.on('SCENE_CANCEL',
    args => mainWindow.webContents.send('SCENE_CANCEL', args)
  );

  emitter.on('SCENE_REMOVED_AFTER_USE',
    args => mainWindow.webContents.send('SCENE_REMOVED_AFTER_USE', args)
  );

  emitter.on('SCENE_PART_START',
    args => mainWindow.webContents.send('SCENE_PART_START', args)
  );

  emitter.on('SCENE_PART_END',
    args => mainWindow.webContents.send('SCENE_PART_END', args)
  );

  emitter.on('SCENE_PART_CANCEL',
    args => mainWindow.webContents.send('SCENE_PART_CANCEL', args)
  );

  emitter.on('RESTORE_STATE',
    () => mainWindow.webContents.send('RESTORE_STATE')
  );
};
