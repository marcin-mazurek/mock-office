import { spawn } from 'redux-saga/effects';
import addQueueFromFileAgent from '../expectations/pickFile/saga';
import addServerAgent from '../servers/addServer/saga';
import serverStartAgent from '../servers/startServer/saga';
import serverStopAgent from '../servers/stopServer/saga';
import removeExpectationAfterUseAgent from '../expectations/removeAfterUse/saga';
import addScriptFromFileAgent from '../serverScripts/addFromFile/saga';
import runScriptAgent from '../serverScripts/runScript/saga';
import syncServers from '../app/syncServers/saga';
import removeExpectationAgent from '../expectations/remove/saga';

export default function* rootSaga() {
  yield [
    yield spawn(syncServers),
    yield spawn(addQueueFromFileAgent),
    yield spawn(addServerAgent),
    yield spawn(serverStartAgent),
    yield spawn(serverStopAgent),
    yield spawn(removeExpectationAfterUseAgent),
    yield spawn(addScriptFromFileAgent),
    yield spawn(runScriptAgent),
    yield spawn(removeExpectationAgent)
  ];
}
