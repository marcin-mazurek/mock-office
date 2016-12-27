import { take, spawn, call, put, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';
import { FILE_PICK, add } from './actions';
import { EXPECTATION_ADD } from '../../common/messageNames';
import { getSelected } from '../servers/selectors';

const expectationAddChannel = () => (
  eventChannel((emitter) => {
    ipcRenderer.on(EXPECTATION_ADD, (event, expectations) => {
      emitter(expectations);
    });

    return () => {};
  })
);

function* expectationAddAgent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { files } = yield take(FILE_PICK);
    const file = files[0];
    const reader = new FileReader();
    const serverId = yield select(getSelected);

    reader.onload = (e) => {
      try {
        const expectations = JSON.parse(e.target.result);
        ipcRenderer.send(EXPECTATION_ADD, {
          serverId,
          expectations
        });
      } catch (parseError) {
        // eslint-disable-next-line no-console
        console.error(parseError.message);
      }
    };
    reader.readAsText(file);

    const channel = yield call(expectationAddChannel);
    const expectations = yield take(channel);
    yield put(add(serverId, expectations));
  }
}

export default function* main() {
  yield [
    spawn(expectationAddAgent)
  ];
}
