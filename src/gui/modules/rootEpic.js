import { combineEpics } from 'redux-observable';
import addServerEpic from '../servers/addServer/epics';
import addHttpMockEpic from './addHttpMock';
import addWsMockEpic from './addWsMock';
import { removeMockEpic } from './removeMock';
import addMockFromFileEpic from './importMock';
import removeServerEpic from '../servers/removeServer/epics';
import saveStateEpic from '../exportState/epics';
import editServerEpic from '../servers/editServer/epics';
import toggleServer from '../servers/toggleServer/epic';
import clearExpiredNotificationsEpic from '../notifications/clearExpiredNotificationsEpic';

export default combineEpics(
  addServerEpic,
  removeMockEpic,
  addMockFromFileEpic,
  removeServerEpic,
  saveStateEpic,
  addHttpMockEpic,
  addWsMockEpic,
  editServerEpic,
  toggleServer,
  clearExpiredNotificationsEpic
);
