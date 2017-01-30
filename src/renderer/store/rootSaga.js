import { spawn } from 'redux-saga/effects';
import addQueueFromFileAgent from '../queues/addFromFile/saga';
import addServerAgent from '../servers/addServer/saga';
import serverStartAgent from '../servers/startServer/saga';
import serverStopAgent from '../servers/stopServer/saga';
import removeResponseAfterUseAgent from '../queues/removeResponseAfterUse/saga';
import addScriptFromFileAgent from '../serverScripts/addFromFile/saga';
import runScriptAgent from '../serverScripts/runScript/saga';
import addResponseAgent from '../servers/views/Server/addResponse/saga';

export default function* rootSaga() {
  yield [
    yield spawn(addQueueFromFileAgent),
    yield spawn(addServerAgent),
    yield spawn(serverStartAgent),
    yield spawn(serverStopAgent),
    yield spawn(removeResponseAfterUseAgent),
    yield spawn(addScriptFromFileAgent),
    yield spawn(runScriptAgent),
    yield spawn(addResponseAgent)
  ];
}
