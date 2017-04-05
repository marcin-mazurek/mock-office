import * as events from './common/eventNames';
import globalEvents from './globalEvents';

export default (mainWindow) => {
  globalEvents.on(events.SCENE_REMOVED,
    args => mainWindow.webContents.send(events.SCENE_REMOVED, args)
  );

  globalEvents.on(events.SCENE_START,
    args => mainWindow.webContents.send(events.SCENE_START, args)
  );

  globalEvents.on(events.SCENE_END,
    args => mainWindow.webContents.send(events.SCENE_END, args)
  );

  globalEvents.on(events.SCENE_CANCEL,
    args => mainWindow.webContents.send(events.SCENE_CANCEL, args)
  );

  globalEvents.on(events.SCENE_REMOVED_AFTER_USE,
    args => mainWindow.webContents.send(events.SCENE_REMOVED_AFTER_USE, args)
  );

  globalEvents.on(events.SCENE_PART_START,
    args => mainWindow.webContents.send(events.SCENE_PART_START, args)
  );

  globalEvents.on(events.SCENE_PART_END,
    args => mainWindow.webContents.send(events.SCENE_PART_END, args)
  );

  globalEvents.on(events.SCENE_PART_CANCEL,
    args => mainWindow.webContents.send(events.SCENE_PART_CANCEL, args)
  );

  globalEvents.on('RESTORE_STATE',
    () => mainWindow.webContents.send('RESTORE_STATE')
  );
};
