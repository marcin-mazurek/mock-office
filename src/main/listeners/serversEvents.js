import { ipcMain } from 'electron';
import {
  ADD_SERVER,
  SERVER_START,
  SERVER_STOP
} from '../../common/messageNames';

const callbacks = {
  add: [],
  start: [],
  stop: []
};

ipcMain.on(ADD_SERVER, (event, arg) => {
  callbacks.add.forEach(cb => cb(arg));
});

ipcMain.on(SERVER_START, (event, args) => {
  callbacks.start.forEach(cb => cb(args));
});

ipcMain.on(SERVER_STOP, (event, args) => {
  callbacks.stop.forEach(cb => cb(args));
});

export default {
  on(eventName, cb) {
    if (!callbacks[eventName]) {
      return;
    }

    callbacks[eventName].push(cb);
  }
};
