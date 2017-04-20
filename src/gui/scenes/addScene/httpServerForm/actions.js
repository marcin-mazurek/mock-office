export const SUBMIT_HTTP_SCENE = 'scenes/SUBMIT_HTTP_SCENE';

export const submitHttpScene = (scenarioId, formValues) => ({
  type: SUBMIT_HTTP_SCENE,
  scenarioId,
  formValues
});
