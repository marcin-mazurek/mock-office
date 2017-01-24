import { take, call, put, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { remote } from 'electron';
import { add } from '../actions';
import { FILE_PICK } from './actions';
import { getSelected } from '../../servers/selectors';

const readerChannel = reader => (
  eventChannel((emitter) => {
    // eslint-disable-next-line no-param-reassign
    reader.onload = e => emitter(JSON.parse(e.target.result));

    return () => {};
  })
);

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const { files } = yield take(FILE_PICK);
      const file = files[0];
      const reader = new FileReader();
      const serverId = yield select(getSelected);

      const rChannel = yield call(readerChannel, reader);
      reader.readAsText(file);
      const expectations = yield take(rChannel);

      const expectationsAdded = remote.require('./dist/main/expectations').default
        .add(serverId, expectations);
      yield put(add(serverId, expectationsAdded));
    } catch (parseError) {
      // eslint-disable-next-line no-console
      console.error(parseError.message);
    }
  }
}
