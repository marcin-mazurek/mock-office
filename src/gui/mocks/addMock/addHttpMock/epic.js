import { Observable } from 'rxjs';
import { requestAddMock } from '../../../api/api';
import { add as addNotification } from '../../../entities/notifications/actions';
import { add } from '../actions';

export const SUBMIT = 'addMock/SUBMIT';

export const submit = (scenarioId, formValues) => ({
  type: SUBMIT,
  scenarioId,
  formValues
});

const processFormValues = (formValues) => {
  const fV = formValues;
  let requirements;

  try {
    const requirementsSubmitted = fV.requirements;
    if (requirementsSubmitted) {
      requirements = JSON.parse(requirementsSubmitted);
      requirements = Object.assign({}, requirements);
    } else {
      requirements = {};
    }

    if (fV.task && fV.task.payload) {
      fV.task.payload = JSON.parse(fV.task.payload);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
  }

  if (fV.task.delay) {
    fV.task.delay = parseInt(fV.task.delay, 10);
  }

  return {
    title: fV.title,
    requirements,
    tasks: [fV.task]
  };
};

export default function addMockEpic(action$) {
  return action$.ofType(SUBMIT)
    .flatMap((action) => {
      const mockParams = processFormValues(action.formValues);

      return Observable.from(
        Promise.all(
          [Object.assign(mockParams, { event: 'RECEIVED_REQUEST' })].map(
            mock => requestAddMock(action.scenarioId, mock)
          )
        )
      );
    })
    .flatMap(mocks => Observable.from(mocks))
    .map(mock => add(...mock))
    .catch(err => Observable.of(addNotification({ text: err.message, type: 'error' })));
}
