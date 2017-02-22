import { combineEpics } from 'redux-observable';
import addServerEpic from '../servers/addServer/epics';
import startServerEpic from '../servers/startServer/epics';
import stopServerEpic from '../servers/stopServer/epics';
import addTaskEpic from '../tasks/addTask/epics';
import removeTaskEpic from '../tasks/removeTask/epics';
import addTaskFromFileEpic from '../tasks/addTaskFromFile/epics';

export default combineEpics(
  addServerEpic,
  startServerEpic,
  stopServerEpic,
  addTaskEpic,
  removeTaskEpic,
  addTaskFromFileEpic
);