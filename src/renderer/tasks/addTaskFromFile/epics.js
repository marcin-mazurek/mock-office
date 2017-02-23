import { Observable } from 'rxjs';
import { INIT } from './actions';
import { getSelected } from '../../servers/selectors';
import { init as initAddTask } from '../addTask/actions';

export default (action$, store) =>
  action$.ofType(INIT)
    .flatMap((action) => {
      try {
        const { files } = action;
        const file = files[0];

        if (file) {
          const fileRead = new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = e => resolve(JSON.parse(e.target.result));
          });

          return Observable.fromPromise(fileRead)
            .map(task => initAddTask(getSelected(store.getState()), task));
        }
      } catch (parseError) {
        // eslint-disable-next-line no-console
        console.error(parseError.message);
      }

      return Observable.fromPromise(Promise.resolve())
        .map(() => ({ type: 'ADD_TASK_FROM_FILE_FAILED' }));
    });
