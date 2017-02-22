import { spawn } from 'redux-saga/effects';
import addQueueFromFileAgent from '../tasks/addTaskFromFile/saga';
import addScriptFromFileAgent from '../serverScripts/addFromFile/saga';
import runScriptAgent from '../serverScripts/runScript/saga';
import syncServers from '../app/syncServers/saga';

export default function* rootSaga() {
  yield [
    yield spawn(syncServers),
    yield spawn(addQueueFromFileAgent),
    yield spawn(addScriptFromFileAgent),
    yield spawn(runScriptAgent)
  ];
}
