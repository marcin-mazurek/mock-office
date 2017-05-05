import { Observable } from 'rxjs';
import { requestAddMock } from '../../../api/api';
import { add as addNotification } from '../../../entities/notifications/actions';
import { add } from '../actions';

export const SUBMIT = 'addHttpMock/SUBMIT';

export const submit = (scenarioId, formValues) => ({
  type: SUBMIT,
  scenarioId,
  formValues
});

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
      }
    }

    fV.task.delay = parseInt(fV.task.delay, 10);
  }

  return {
    mock: {
      title: fV.title,
      requirements,
      tasks: [fV.task]
    }
  };
};

export default function addMockEpic(action$) {
  return action$.ofType(SUBMIT)
    .flatMap((action) => {
      try {
        const { mock, error } = processFormValues(action.formValues);

        if (error) {
          return Observable.of(addNotification({ text: error.message, type: 'error' }))
        }

        return Observable.from(
          Promise.all(
            [Object.assign(mock, { event: 'RECEIVED_REQUEST' })].map(
              mock => requestAddMock(action.scenarioId, mock)
            )
          )
        )
          .flatMap(mocks => Observable.from(mocks))
          .map(mock => add(...mock));
      } catch (error) {
        return Observable.of(addNotification({ text: error.message, type: 'error' }));
      }
    });
}
