import {
  take,
  put,
  call
} from 'redux-saga/effects';
import { remote } from 'electron';
import { INIT } from './actions';
import { start } from '../actions';
import prepareForEffect from '../../utils/redux-saga';

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { id } = yield take(INIT);
    const remoteStart = remote.require('./dist/main/servers').default.start;
    yield call(prepareForEffect(remoteStart), id);
    yield put(start(id));
  }
}
