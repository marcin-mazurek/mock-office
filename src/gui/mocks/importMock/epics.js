import { Observable } from 'rxjs';
import { INIT, failAction } from './actions';
import { requestAddMock } from '../../api/api';
import { add as addNotification } from '../../entities/notifications/actions';
import { add } from '../addMock/actions';

export default action$ =>
  action$.ofType(INIT)
    .flatMap((action) => {
      try {
        const { serverId, files } = action;
        const file = files[0];

        if (file) {
          const fileRead = new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = e => resolve(JSON.parse(e.target.result));
          });

          return Observable.fromPromise(fileRead)
            .flatMap(mocks =>
              Observable.from(
                Promise.all(mocks.map(mock => requestAddMock(serverId, mock)))
              )
            )
            .flatMap(mocks => Observable.from(mocks))
            .map(mock => add(...mock))
            .catch(err => Observable.of(addNotification({ text: err.message, type: 'error' })));
        }
      } catch (parseError) {
        // eslint-disable-next-line no-console
        console.error(parseError.message);
      }

      return Observable.fromPromise(Promise.resolve())
        .map(failAction);
    });
