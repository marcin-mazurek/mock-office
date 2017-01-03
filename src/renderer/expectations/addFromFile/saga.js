import { take, call, put, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';
import { add } from '../actions';
import { FILE_PICK } from './actions';
import { EXPECTATION_ADD } from '../../../common/messageNames';
import { getSelected } from '../../servers/selectors';

const expectationAddChannel = () => (
  eventChannel((emitter) => {
    ipcRenderer.on(EXPECTATION_ADD, (event, expectations) => {
      emitter(expectations);
    });

    return () => {};
  })
);

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

      ipcRenderer.send(EXPECTATION_ADD, {
        serverId,
        expectations
      });

      const channel = yield call(expectationAddChannel);
      const expectationsAdded = yield take(channel);
      yield put(add(serverId, expectationsAdded));
    } catch (parseError) {
      // eslint-disable-next-line no-console
      console.error(parseError.message);
    }
  }
}
