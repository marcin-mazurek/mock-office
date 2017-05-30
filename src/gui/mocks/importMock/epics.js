import { Observable } from 'rxjs';
import { ifElse } from 'ramda';
import { INIT, cancelAction } from './actions';
import api from '../../resources/api';
import { addAction as addNotification } from '../../notifications/actions';
import { actionCreators } from '../../entities/module';

const preparePayload = (action) => {
  const { scenario, server, files } = action;
  const file = files[0];

  if (file) {
    const fileRead = new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = e => resolve({
        mocks: JSON.parse(e.target.result),
        scenario,
        server
      });
    });

    return Observable.fromPromise(fileRead);
  }

  return { cancelled: true };
};
const isCancelled = readResult => readResult.cancelled;
const onCancel = () => [cancelAction()];
const makeRequests = requestParams => Observable.from(
  Promise.all(
    requestParams.mocks.map(
      mock => api.addMock(requestParams.server, requestParams.scenario, mock)
    )
  )
);
const onFileRead = requestParams =>
  makeRequests(requestParams)
    .flatMap((responses, index) => {
      const actions = [];

      responses.forEach((response) => {
        const { data, error } = response;

        if (error) {
          actions.push(Observable.of(
            addNotification({
              text: error,
              type: 'error'
            })));
          return;
        }

        const mock = Object.assign(
          Object.assign(
            {},
            requestParams.mocks[index]
          ),
          { id: data.id }
        );
        actions.push(actionCreators.addMockAction(
          requestParams.scenario,
          data.id,
          mock
        ));
        requestParams.mocks[index].tasks.forEach((task, taskIndex) => {
          Object.assign(task, { id: data.tasks[taskIndex] });
          actions.push(actionCreators.addTaskAction(
            data.id,
            data.tasks[taskIndex],
            Object.assign({}, task, { id: data.tasks[taskIndex] })
          ));
        });
      });

      return actions;
    });

export default action$ =>
  action$.ofType(INIT)
    .flatMap(preparePayload)
    .flatMap(
      ifElse(
        isCancelled,
        onCancel,
        onFileRead
      )
    );
