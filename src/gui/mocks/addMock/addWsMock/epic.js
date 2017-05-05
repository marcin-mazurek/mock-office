import { Observable } from 'rxjs';
import { requestAddMock } from '../../../api/api';
import { add as addNotification } from '../../../entities/notifications/actions';
import { add } from '../actions';

export const SUBMIT = 'addWsMock/SUBMIT';

export const submit = (scenarioId, formValues) => ({
  type: SUBMIT,
  scenarioId,
  formValues
});

const processFormValues = (formValues) => {
  let error;
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

  Object.assign(requirements, { event: fV.event });

  fV.tasks.forEach((task) => {
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
    }
  });

  if (error) {
    return error;
  }

  return {
    mock: {
      title: fV.title,
      requirements,
      tasks: fV.tasks
    }
  };
};

export default function addWsMockEpic(action$) {
  return action$.ofType(SUBMIT)
    .flatMap((action) => {
      try {
        const { mock, error } = processFormValues(action.formValues);

        if (error) {
          return Observable.of(addNotification({ text: error.message, type: 'error' }))
        }

        return Observable.from(
          Promise.all(
            [mock].map(
              mock => requestAddMock(action.scenarioId, mock)
            )
          )
        )
          .flatMap(mocks => Observable.from(mocks))
          .map(mock => add(...mock))
          .catch(error => Observable.of(addNotification({ text: error.message, type: 'error' })))
      } catch (error) {
        return Observable.of(addNotification({ text: error.message, type: 'error' }));
      }
    });
}
