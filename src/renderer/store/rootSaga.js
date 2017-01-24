import { spawn } from 'redux-saga/effects';
import addExpectationFromFileAgent from '../expectations/addFromFile/saga';
import addServerAgent from '../servers/addServer/saga';
import serverStartAgent from '../servers/startServer/saga';
import serverStopAgent from '../servers/stopServer/saga';
import loadExpectationAgent from '../expectations/loadExpectation/saga';
import unloadExpectationAgent from '../expectations/unloadExpectation/saga';
import unloadExpectationAfterUseAgent from '../expectations/unloadExpectationAfterUse/saga';
import addScriptFromFileAgent from '../serverScripts/addFromFile/saga';
import runScriptAgent from '../serverScripts/runScript/saga';

export default function* rootSaga() {
  yield [
    yield spawn(addExpectationFromFileAgent),
    yield spawn(addServerAgent),
    yield spawn(serverStartAgent),
    yield spawn(serverStopAgent),
    yield spawn(loadExpectationAgent),
    yield spawn(unloadExpectationAgent),
    yield spawn(unloadExpectationAfterUseAgent),
    yield spawn(addScriptFromFileAgent),
    yield spawn(runScriptAgent)
  ];
}
