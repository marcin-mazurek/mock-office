import { combineEpics } from 'redux-observable';
import addServerEpic from '../servers/addServer/epics';
import startServerEpic from '../servers/startServer/epics';
import stopServerEpic from '../servers/stopServer/epics';
import addSceneEpic from '../scenes/addScene/epics';
import submitHttpSceneEpic from '../scenes/addScene/httpServerForm/epics';
import { removeSceneEpic, removeSceneAfterUseEpic } from '../scenes/removeScene/epics';
import addSceneFromFileEpic from '../scenes/addSceneFromFile/epics';
import removeServerEpic from '../servers/removeServer/epics';
import saveStateEpic from '../exportState/epics';
// currently renaming is not supported by rest-api
// import renameServerEpic from '../servers/renameServer/epics';

export default combineEpics(
  addServerEpic,
  startServerEpic,
  stopServerEpic,
  addSceneEpic,
  removeSceneEpic,
  removeSceneAfterUseEpic,
  addSceneFromFileEpic,
  removeServerEpic,
  saveStateEpic,
  submitHttpSceneEpic
  // renameServerEpic
);
