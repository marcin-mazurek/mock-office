import { ipcMain } from 'electron';
import {
  EXPECTATION_ADD,
  EXPECTATION_LOAD,
  EXPECTATION_UNLOAD
} from '../../common/messageNames';

const callbacks = {
  load: [],
  unload: [],
  add: []
};

ipcMain.on(EXPECTATION_LOAD, (event, arg) => {
  callbacks.load.forEach(cb => cb(arg));
});

ipcMain.on(EXPECTATION_UNLOAD, (event, arg) => {
  callbacks.unload.forEach(cb => cb(arg));
});

ipcMain.on(EXPECTATION_ADD, (event, arg) => {
  callbacks.add.forEach(cb => cb(arg));
});

export default {
  on(eventName, cb) {
    if (!callbacks[eventName]) {
      return;
    }

    callbacks[eventName].push(cb);
  }
};
