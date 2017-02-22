import { combineEpics } from 'redux-observable';
import addServerEpic from '../servers/addServer/epics';

export default combineEpics(
  addServerEpic
);
