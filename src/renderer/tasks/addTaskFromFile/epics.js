import { Observable } from 'rxjs';
import { INIT } from './actions';
import { getSelected } from '../../servers/selectors';
import { init as initAddTask } from '../addTask/actions';

export default (action$, store) =>
  action$.ofType(INIT)
    .mergeMap((action) => {
      try {
        const { files } = action;
        const file = files[0];

        if (file) {
          const reader = new FileReader();
          const serverId = getSelected(store.getState());
          const readerPromise = new Promise((resolve) => {
            reader.readAsText(file);
            reader.onload = e => resolve(JSON.parse(e.target.result));
          });

          return Observable.fromPromise(readerPromise)
            .map(task => initAddTask(serverId, task));
        }
      } catch (parseError) {
        // eslint-disable-next-line no-console
        console.error(parseError.message);
      }

      return Observable.fromPromise(Promise.resolve())
        .map(() => ({ type: 'ADD_TASK_FROM_FILE_FAILED' }));
    });
