import { take, call, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { remote } from 'electron';
import { INIT } from './actions';
import { getSelected } from '../../servers/selectors';
import addResponseSaga from '../add/saga';

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
      const { files } = yield take(INIT);
      const file = files[0];

      if (file) {
        const reader = new FileReader();
        const serverId = yield select(getSelected);

        const rChannel = yield call(readerChannel, reader);
        reader.readAsText(file);
        const expectation = yield take(rChannel);
        const queues = remote.require('./dist/main/queues').default;
        const queueId = queues.getServerQueueId(serverId);
        yield call(addResponseSaga, queueId, expectation.response);
      }
    } catch (parseError) {
      // eslint-disable-next-line no-console
      console.error(parseError.message);
    }
  }
}
