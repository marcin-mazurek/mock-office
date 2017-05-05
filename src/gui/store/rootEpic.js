import { combineEpics } from 'redux-observable';
import addServerEpic from '../servers/addServer/epics';
import startServerEpic from '../servers/startServer/epics';
import stopServerEpic from '../servers/stopServer/epics';
import addMockEpic from '../mocks/addMock/epics';
import submitHttpMockEpic from '../mocks/addMock/addHttpMock/epic';
import { removeMockEpic, removeMockAfterUseEpic } from '../mocks/removeMock/epics';
import addMockFromFileEpic from '../mocks/importMock/epics';
import removeServerEpic from '../servers/removeServer/epics';
import saveStateEpic from '../exportState/epics';
import editServerEpic from '../servers/editServer/epics';

export default combineEpics(
  addServerEpic,
  startServerEpic,
  stopServerEpic,
  addMockEpic,
  removeMockEpic,
  removeMockAfterUseEpic,
  addMockFromFileEpic,
  removeServerEpic,
  saveStateEpic,
  submitHttpMockEpic,
  editServerEpic
);
