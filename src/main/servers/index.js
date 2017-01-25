import unique from 'node-unique';
import HttpServer from './httpServer';
import WSMockServer from './wsServer';
import { EXPECTATION_UNLOAD_AFTER_USE } from '../../common/messageNames';
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
  stop(id) {
    const serverToStop = servers[id];

    if (serverToStop.isLive()) {
      return new Promise((resolve) => {
        serverToStop.stop(() => {
          // eslint-disable-next-line no-console
          console.log('Mockee server is shut down!');
          resolve();
        });
      });
    }

    // eslint-disable-next-line no-console
    console.log('Mockee server is shut down!');
    return Promise.resolve();
  },
  loadExpectation(serverId, expectationId, quantity, infinite) {
    return servers[serverId].load(expectationId, quantity, infinite);
  },
  unloadExpectation(serverId, expectationId) {
    servers[serverId].unload(expectationId);
  },
  addExpectation(serverId, expectationsToAdd) {
    const serverToAddMock = servers[serverId];
    const expectationsIds = expectationsToAdd.map(
      exp => expectations.add(serverToAddMock.type, exp)
    );
    serverToAddMock.add(expectationsIds);
    return expectationsToAdd.map((exp, index) =>
      Object.assign({}, exp,
        {
          id: expectationsIds[index],
          type: serverToAddMock.type
        })
    );
  },
  get(id) {
    return servers[id];
  },
  init(win) {
    mainWindow = win;
  },
};

export default api;
