import 'rxjs/operator/map';
import 'rxjs/operator/mergeMap';
import { clearExpiredNotificationsEpic } from 'notifications';
import { combineEpics } from 'redux-observable';
import addServerEpic from './addServer';
import addHttpMockEpic from './addMock';
import { removeMockEpic } from './removeMock';
import addMockFromFileEpic from './importMock';
import removeServerEpic from './removeServer';
import exportStateEpic from './exportState/exportStateEpic';
import editServerEpic from './editServer';
import toggleServer from './toggleServer';

export default combineEpics(
  addServerEpic,
  removeMockEpic,
  addMockFromFileEpic,
  removeServerEpic,
  exportStateEpic,
  addHttpMockEpic,
  editServerEpic,
  toggleServer,
  clearExpiredNotificationsEpic
);
