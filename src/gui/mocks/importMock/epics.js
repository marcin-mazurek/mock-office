import { Observable } from 'rxjs';
import { INIT, failAction } from './actions';
import { requestAddMock } from '../../api/api';
import { add as addNotification } from '../../entities/notifications/actions';
import { add } from '../../entities/mocks/actions';
import { add as addTask } from '../../entities/tasks/actions';

export default action$ =>
  action$.ofType(INIT)
    .flatMap((action) => {
      try {
        const { scenario, server, files } = action;
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
                Promise.all(mocks.map(mock => requestAddMock(server, mock)))
              )
                .flatMap((responses, index) => {
                  const actions = [];
                  responses.forEach((response) => {
                    const mock = Object.assign(
                      { id: response.id },
                      Object.assign(
                        {},
                        mocks[index]
                      )
                    );
                    actions.push(add(
                      scenario,
                      response.id,
                      mock
                    ));
                    mocks[index].tasks.forEach((task, taskIndex) => {
                      Object.assign(task, { id: response.tasks[taskIndex] });
                      actions.push(addTask(
                        response.tasks[taskIndex],
                        Object.assign({}, task, { id: response.tasks[taskIndex] })
                      ));
                    });
                  });

                  return actions;
                })
                .catch(err => Observable.of(addNotification({ text: err.message, type: 'error' })))
            );
        }
      } catch (parseError) {
        // eslint-disable-next-line no-console
        console.error(parseError.message);
      }

      return Observable.fromPromise(Promise.resolve())
        .map(failAction);
    });
