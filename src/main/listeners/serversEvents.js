import { ipcMain } from 'electron';
import {
  SERVER_ADD
} from '../../common/messageNames';

const callbacks = {
  add: []
};

ipcMain.on(SERVER_ADD, (event, arg) => {
  callbacks.load.forEach(cb => cb(arg));
});

export default {
  on(eventName, cb) {
    if (!callbacks[eventName]) {
      return;
    }

    callbacks[eventName].push(cb);
  }
};
