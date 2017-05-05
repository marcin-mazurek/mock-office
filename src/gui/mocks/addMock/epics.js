import { Observable } from 'rxjs';
import { INIT, add } from './actions';
import { requestAddMock } from '../../api/api';
import { add as addNotification } from '../../entities/notifications/actions';

export const addMock = observable =>
  observable
    .flatMap((action) => {
      const { serverId, mocks } = action;

      return Observable.from(
        Promise.all(mocks.map(mock => requestAddMock(serverId, mock)))
      );
    })
    .flatMap(mocks => Observable.from(mocks))
    .map(mock => add(...mock))
    .catch(err => Observable.of(addNotification({ text: err.message, type: 'error' })));

const addMockEpic = action$ => addMock(action$.ofType(INIT));

export default addMockEpic;
