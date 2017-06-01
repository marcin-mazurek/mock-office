import { Observable } from 'rxjs';
import { ifElse, has } from 'ramda';
import api from '../../../resources/api';
import { FORM_SUBMITTED } from './AddWsMockForm';

export const SUCCEED = 'addWsMock/SUCCEED';
export const succeedAction = (scenario, mock) => ({
  type: SUCCEED,
  scenario,
  mock
});
export const FAILED = 'addWsMock/FAILED';
export const failedAction = reason => ({
  type: FAILED,
  reason
});

const hasError = has('error');
const processFormValues = (values) => {
  let error;
  const fV = values.toJS();
  let requirements;

  const requirementsSubmitted = fV.requirements;
  if (requirementsSubmitted) {
    try {
      requirements = JSON.parse(requirementsSubmitted);
    } catch (e) {
      throw new Error('Requirements JSON is broken');
    }
    requirements = Object.assign({}, requirements);
  } else {
    requirements = {};
  }

  Object.assign(requirements, { event: fV.event });

  fV.tasks.forEach((task) => {
    /* eslint-disable no-param-reassign */
    if (error) {
      return;
    }

    if (task && task.payload) {
      try {
        task.payload = JSON.parse(task.payload);
      } catch (err) {
        error = { message: 'Payload JSON is broken' };
      }
    }

    if (task.delay) {
      if (task.delay < 0) {
        error = { message: 'Delay is < 0' };
      }

      task.delay = parseInt(task.delay, 10);
      /* eslint-enable no-param-reassign */
    }
  });

  if (error) {
    return { error: error.message };
  }

  return {
    data: {
      title: fV.title,
      requirements,
      tasks: fV.tasks
    }
  };
};
const onFail = result => failedAction(result.error);
const onSuccess = result => succeedAction(result.data.scenario, result.data.mock);

export default function addWsMockEpic(action$) {
  return action$.ofType(FORM_SUBMITTED)
    .flatMap((action) => {
      const { data, error } = processFormValues(action.values);

      if (error) {
        return { error };
      }

      const reqWithEvent = Object.assign({}, data.requirements, { event: 'RECEIVED_REQUEST' });

      return Observable.from(
        api.addMock(action.server, action.scenario, Object.assign(data,
          {
            requirements: reqWithEvent
          }
        ))
      );
    })
    .map(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
}
