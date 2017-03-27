import { combineEpics } from 'redux-observable';
import addServerEpic from '../servers/addServer/epics';
import startServerEpic from '../servers/startServer/epics';
import stopServerEpic from '../servers/stopServer/epics';
import addSceneEpic from '../scenes/addScene/epics';
import removeSceneEpic from '../scenes/removeScene/epics';
import addSceneFromFileEpic from '../scenes/addSceneFromFile/epics';
import removeServerEpic from '../servers/removeServer/epics';

export default combineEpics(
  addServerEpic,
  startServerEpic,
  stopServerEpic,
  addSceneEpic,
  removeSceneEpic,
  addSceneFromFileEpic,
  removeServerEpic
);
