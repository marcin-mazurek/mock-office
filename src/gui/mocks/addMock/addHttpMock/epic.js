import { Observable } from 'rxjs';
import { ifElse, has } from 'ramda';
import api from '../../../resources/api';
import { addAction as addNotification } from '../../../notifications/actions';
import { SUBMIT } from './actions';

export const SUCCEED = 'addMock/SUCCEED';
export const succeedAction = (scenario, mock) => ({
  type: SUCCEED,
  scenario,
  mock
});
export const FAILED = 'addMock/FAILED';
export const failedAction = reason => ({
  type: FAILED,
  reason
});

const hasError = has('error');
const processFormValues = (formValues) => {
  const fV = formValues;
  let requirements;

  const requirementsSubmitted = fV.requirements;
  if (requirementsSubmitted) {
    try {
      requirements = JSON.parse(requirementsSubmitted);
    } catch (error) {
      throw new Error('Requirements JSON is broken');
    }
    requirements = Object.assign({}, requirements);
  } else {
    requirements = {};
  }

  if (fV.task && fV.task.payload) {
    try {
      fV.task.payload = JSON.parse(fV.task.payload);
    } catch (error) {
      throw new Error('Payload JSON is broken');
    }
  }

  if (fV.task.delay) {
    if (fV.task.delay < 0) {
      return {
        error: {
          message: 'Delay is < 0'
        }
      };
    }

    fV.task.delay = parseInt(fV.task.delay, 10);
  }

  return {
    data: {
      title: fV.title,
      requirements,
      tasks: [fV.task]
    }
  };
};

const onFail = result => failedAction(result.error);
const onSuccess = result => succeedAction(result.data.scenario, result.data.mock);

export default function addMockEpic(action$) {
  return action$.ofType(SUBMIT)
    .flatMap((action) => {
      try {
        const { data, error } = processFormValues(action.formValues);

        if (error) {
          return Promise.resolve({ error });
        }

        const reqWithEvent = Object.assign({}, data.requirements, { event: 'RECEIVED_REQUEST' });

        return Observable.from(
          api.addMock(action.server, action.scenario, Object.assign(data,
            {
              requirements: reqWithEvent
            }
          )));
      } catch (error) {
        return Observable.of(addNotification({ text: error.message, type: 'error' }));
      }
    })
    .map(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
}
