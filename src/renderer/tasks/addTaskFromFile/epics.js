import { Observable } from 'rxjs';
import { INIT } from './actions';
import { init as initAddTask } from '../addTask/actions';

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
            .map(tasks => initAddTask(serverId, tasks));
        }
      } catch (parseError) {
        // eslint-disable-next-line no-console
        console.error(parseError.message);
      }

      return Observable.fromPromise(Promise.resolve())
        .map(() => ({ type: 'ADD_TASK_FROM_FILE_FAILED' }));
    });
