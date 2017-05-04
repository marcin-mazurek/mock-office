import { init } from '../actions';

export const SUBMIT_HTTP_SCENE = 'scenes/SUBMIT_HTTP_SCENE';

export const submitHttpScene = (scenarioId, formValues) => ({
  type: SUBMIT_HTTP_SCENE,
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

export default function addSceneEpic(action$) {
  return action$.ofType(SUBMIT_HTTP_SCENE)
    .map((action) => {
      const sceneParams = processFormValues(action.formValues);
      return init(action.scenarioId, [Object.assign(sceneParams, { event: 'RECEIVED_REQUEST' })]);
    });
}
