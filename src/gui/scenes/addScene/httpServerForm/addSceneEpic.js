import { init } from '../actions';

export const SUBMIT_HTTP_SCENE = 'scenes/SUBMIT_HTTP_SCENE';

export const submitHttpScene = (scenarioId, formValues) => ({
  type: SUBMIT_HTTP_SCENE,
  scenarioId,
  formValues
});

const processFormValues = (formValues) => {
  let fV = formValues;
  let requirements;

  try {
    const requirementsSubmitted = fV.get('requirements');
    if (requirementsSubmitted) {
      requirements = JSON.parse(requirementsSubmitted);
      requirements = Object.assign({}, requirements);
    } else {
      requirements = {};
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
  }

  if (fV.getIn(['scenePart', 'payload'])) {
    // temporary solution for parsing json payload from form
    // should be done within epic
    fV = fV.setIn(
      ['scenePart', 'payload'],
      JSON.parse(fV.getIn(['scenePart', 'payload']))
    );
  }

  fV = fV.updateIn(['scenePart', 'delay'], (delay) => {
    if (!delay) {
      return delay;
    }

    return parseInt(delay, 10);
  });

  return {
    title: fV.get('title'),
    requirements,
    parts: [
      fV.get('scenePart').toJS()
    ]
  };
};

export default function addSceneEpic(action$) {
  return action$.ofType(SUBMIT_HTTP_SCENE)
    .map((action) => {
      const sceneParams = processFormValues(action.formValues);
      return init(action.scenarioId, [Object.assign(sceneParams, { event: 'RECEIVED_REQUEST' })]);
    });
}
