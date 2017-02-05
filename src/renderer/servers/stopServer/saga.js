import { take, call, put } from 'redux-saga/effects';
import { remote } from 'electron';
import { stop } from '../actions';
import { INIT } from './actions';
import prepareForEffect from '../../utils/redux-saga';

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { id } = yield take(INIT);
    const remoteStop = remote.require('./main/servers').default.stop;
    yield call(prepareForEffect(remoteStop), id);
    yield put(stop(id));
  }
}
