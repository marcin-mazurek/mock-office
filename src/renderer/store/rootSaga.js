import { spawn } from 'redux-saga/effects';
import addQueueFromFileAgent from '../tasks/addTaskFromFile/saga';
import removeTaskAfterUseAgent from '../tasks/removeTaskAfterUse/saga';
import addScriptFromFileAgent from '../serverScripts/addFromFile/saga';
import runScriptAgent from '../serverScripts/runScript/saga';
import syncServers from '../app/syncServers/saga';
import removeTaskAgent from '../tasks/removeTask/saga';

export default function* rootSaga() {
  yield [
    yield spawn(syncServers),
    yield spawn(addQueueFromFileAgent),
    yield spawn(removeTaskAfterUseAgent),
    yield spawn(addScriptFromFileAgent),
    yield spawn(runScriptAgent),
    yield spawn(removeTaskAgent)
  ];
}
