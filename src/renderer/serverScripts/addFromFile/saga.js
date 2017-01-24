import { take, call, select, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { FILE_PICK } from './actions';
import { getSelected } from '../../servers/selectors';

const readerChannel = reader => (
  eventChannel((emitter) => {
    // eslint-disable-next-line no-param-reassign
    reader.onload = e => emitter(e.target.result);

    return () => {
    };
  })
);

export default function* agent() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { files } = yield take(FILE_PICK);
    const file = files[0];
    const reader = new FileReader();
    const serverId = yield select(getSelected);

    const rChannel = yield call(readerChannel, reader);
    reader.readAsText(file);
    const scriptContent = yield take(rChannel);
    yield put({ type: 'serverScripts/ADD', serverId, content: scriptContent, name: file.name });
  }
}
