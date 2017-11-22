import 'rxjs/operator/map';
import 'rxjs/operator/mergeMap';
import { clearExpiredNotificationsEpic } from 'notifications';
import { combineEpics } from 'redux-observable';
import addServerEpic from './addServer';
import addHttpBehaviourEpic from './addBehaviour';
import { removeBehaviourEpic } from './removeBehaviour';
import addBehaviourFromFileEpic from './importBehaviour';
import removeServerEpic from './removeServer';
import exportStateEpic from './exportState/exportStateEpic';
import editServerEpic from './editServer';
import toggleServer from './toggleServer';
import loadStateOnStart from './loadStateOnStart';

export default combineEpics(
  addServerEpic,
  removeBehaviourEpic,
  addBehaviourFromFileEpic,
  removeServerEpic,
  exportStateEpic,
  addHttpBehaviourEpic,
  editServerEpic,
  toggleServer,
  clearExpiredNotificationsEpic,
  loadStateOnStart
);
