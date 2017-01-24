import { ipcMain } from 'electron';
import unique from 'node-unique';
import HttpExpectation from './httpExpectation/Expectation';
import WsExpectation from './wsExpectation';
import serversService from '../servers';
import {
  EXPECTATION_LOAD,
  EXPECTATION_UNLOAD
} from '../../common/messageNames';

const types = {
  http: HttpExpectation,
  ws: WsExpectation
};
const expectations = [];

const save = (type, config) => {
  const id = unique();
  expectations[id] = {
    type,
    config
  };

  return id;
};

const create = (id) => {
  const { type, config } = expectations[id];
  return new types[type](id, config);
};

const get = id => expectations[id];
let mainWindow;

export default {
  add(serverId, expectationsToAdd) {
    const serverToAddMock = serversService.get(serverId);
    const expectationsIds = expectationsToAdd.map(
      exp => save(serverToAddMock.type, exp)
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
  init(win) {
    mainWindow = win;

    ipcMain.on(EXPECTATION_LOAD, (event, args) => {
      const id = serversService.get(args.serverId)
        .load(args.expectationId, args.quantity, args.infinite);
      mainWindow.webContents.send(EXPECTATION_LOAD, { id });
    });

    ipcMain.on(EXPECTATION_UNLOAD, (event, args) => {
      serversService.get(args.serverId).unload(args.expectationId);
      mainWindow.webContents.send(EXPECTATION_UNLOAD);
    });
  },
  get,
  create
};
