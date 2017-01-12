import { take, call, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ipcRenderer } from 'electron';
import { FILE_PICK } from './actions';
import { ADD_SCRIPT } from '../../../common/messageNames';
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
    const script = yield take(rChannel);

    ipcRenderer.send(ADD_SCRIPT, {
      serverId,
      script
    });
  }
}
