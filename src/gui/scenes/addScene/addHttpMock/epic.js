import { Observable } from 'rxjs';
import { requestAddScene } from '../../../api/api';
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

    if (fV.scenePart && fV.scenePart.payload) {
      fV.scenePart.payload = JSON.parse(fV.scenePart.payload);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
  }

  if (fV.scenePart.delay) {
    fV.scenePart.delay = parseInt(fV.scenePart.delay, 10);
  }

  return {
    title: fV.title,
    requirements,
    parts: [fV.scenePart]
  };
};

export default function addMockEpic(action$) {
  return action$.ofType(SUBMIT)
    .flatMap((action) => {
      const sceneParams = processFormValues(action.formValues);

      return Observable.from(
        Promise.all(
          [Object.assign(sceneParams, { event: 'RECEIVED_REQUEST' })].map(
            scene => requestAddScene(action.scenarioId, scene)
          )
        )
      );
    })
    .flatMap(scenes => Observable.from(scenes))
    .map(scene => add(...scene))
    .catch(err => Observable.of(addNotification({ text: err.message, type: 'error' })));
}
