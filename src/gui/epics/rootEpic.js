import { combineEpics } from 'redux-observable';
import addServerEpic from '../servers/addServer/epics';
import addHttpMockEpic from './addHttpMock';
import addWsMockEpic from './addWsMock';
import { removeMockEpic } from './removeMock';
import addMockFromFileEpic from './importMock';
import removeServerEpic from '../servers/removeServer/epics';
import exportStateEpic from './exportState/exportStateEpic';
import editServerEpic from '../servers/editServer/epics';
import toggleServer from '../servers/toggleServer/epic';
import clearExpiredNotificationsEpic from './clearExpiredNotifications';

export default combineEpics(
  addServerEpic,
  removeMockEpic,
  addMockFromFileEpic,
  removeServerEpic,
  exportStateEpic,
  addHttpMockEpic,
  addWsMockEpic,
  editServerEpic,
  toggleServer,
  clearExpiredNotificationsEpic
);
