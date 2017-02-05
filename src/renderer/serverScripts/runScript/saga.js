import { take, put } from 'redux-saga/effects';
import { remote } from 'electron';
import { INIT } from './actions';
import { run } from '../actions';

export default function* runScriptAgent() {
  const { script, server } = yield take(INIT);
  const remoteRun = remote.require('./main/customScripts').default;

  remoteRun(server, script.content);
  yield put(run(script.id));
}
