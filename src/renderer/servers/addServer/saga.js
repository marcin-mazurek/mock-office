import { take, put } from 'redux-saga/effects';
import { remote } from 'electron';
import { INIT } from './actions';
import { add } from '../actions';

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { name, port, serverType: type } = yield take(INIT);
    const id = remote.require('./dist/main/servers').default
      .add(name, port, type);
    yield put(add(name, port, type, id));
  }
}
