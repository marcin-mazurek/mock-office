import { combineEpics } from 'redux-observable';
import addServerEpic from '../servers/addServer/epics';
import startServerEpic from '../servers/startServer/epics';
import stopServerEpic from '../servers/stopServer/epics';
import addDescriptionEpic from '../descriptions/addDescription/epics';
import removeDescriptionEpic from '../descriptions/removeDescription/epics';
import addDescriptionFromFileEpic from '../descriptions/addDescriptionFromFile/epics';
import removeServerEpic from '../servers/removeServer/epics';

export default combineEpics(
  addServerEpic,
  startServerEpic,
  stopServerEpic,
  addDescriptionEpic,
  removeDescriptionEpic,
  addDescriptionFromFileEpic,
  removeServerEpic
);
