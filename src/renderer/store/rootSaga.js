import { spawn } from 'redux-saga/effects';
import addQueueFromFileAgent from '../tasks/addTaskFromFile/saga';
import serverStartAgent from '../servers/startServer/saga';
import serverStopAgent from '../servers/stopServer/saga';
import removeTaskAfterUseAgent from '../tasks/removeTaskAfterUse/saga';
import addScriptFromFileAgent from '../serverScripts/addFromFile/saga';
import runScriptAgent from '../serverScripts/runScript/saga';
import syncServers from '../app/syncServers/saga';
import removeTaskAgent from '../tasks/removeTask/saga';
import addTaskAgent from '../tasks/addTask/saga';

export default function* rootSaga() {
  yield [
    yield spawn(syncServers),
    yield spawn(addQueueFromFileAgent),
    yield spawn(serverStartAgent),
    yield spawn(serverStopAgent),
    yield spawn(removeTaskAfterUseAgent),
    yield spawn(addScriptFromFileAgent),
    yield spawn(runScriptAgent),
    yield spawn(removeTaskAgent),
    yield spawn(addTaskAgent)
  ];
}
