import { ipcMain } from 'electron';
import unique from 'node-unique';
import HttpServer from './httpServer';
import WSMockServer from './wsServer';
import {
  SERVER_STOP,
  EXPECTATION_UNLOAD_AFTER_USE,
  EXPECTATION_ADD,
  EXPECTATION_LOAD,
  EXPECTATION_UNLOAD
} from '../../common/messageNames';
import expectations from '../expectations';

const serverTypes = {
  http: HttpServer,
  ws: WSMockServer
};

const servers = {};
let mainWindow;

const emitUnload = (serverId, expectationId) => {
  mainWindow.webContents.send(EXPECTATION_UNLOAD_AFTER_USE, { serverId, expectationId });
};

const api = {
  add(name, port, type) {
    const id = unique();
    const Server = serverTypes[type];
    servers[id] = new Server({ name, port, id, emitUnload });
    return { name, port, type, id };
  },
  start(id) {
    const serverToStart = servers[id];

    if (!serverToStart.isLive()) {
      return new Promise((resolve) => {
        serverToStart.start(() => {
          serverToStart.respond();
          // eslint-disable-next-line no-console
          console.log('Mockee server is running!');
          resolve();
        });
      });
    }

    // eslint-disable-next-line no-console
    console.log('Mockee server is running!');
    return Promise.resolve();
  },
  init(win) {
    mainWindow = win;

    ipcMain.on(SERVER_STOP, (event, id) => {
      const serverToStop = servers[id];

      if (serverToStop.isLive()) {
        serverToStop.stop(() => {
          mainWindow.webContents.send(SERVER_STOP);
          // eslint-disable-next-line no-console
          console.log('Mockee server is shut down!');
        });
      }
    });

    ipcMain.on(EXPECTATION_LOAD, (event, args) => {
      const id = servers[args.serverId].load(args.expectationId, args.quantity, args.infinite);
      mainWindow.webContents.send(EXPECTATION_LOAD, { id });
    });

    ipcMain.on(EXPECTATION_UNLOAD, (event, args) => {
      servers[args.serverId].unload(args.expectationId);
      mainWindow.webContents.send(EXPECTATION_UNLOAD);
    });

    ipcMain.on(EXPECTATION_ADD, (event, args) => {
      const serverToAddMock = servers[args.serverId];
      const expectationsIds = args.expectations.map(
        exp => expectations.add(serverToAddMock.type, exp)
      );
      serverToAddMock.add(expectationsIds);
      mainWindow.webContents.send(EXPECTATION_ADD, args.expectations.map((exp, index) =>
        Object.assign({}, exp,
          {
            id: expectationsIds[index],
            type: serverToAddMock.type
          })
      ));
    });
  },
  get(id) {
    return servers[id];
  }
};

export default api;
