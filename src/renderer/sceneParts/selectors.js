export const getSceneParts = (state, sceneId) =>
{
  return state.getIn(['scenes', sceneId]).get('parts')
    .map(partId => state.getIn(['sceneParts', 'entities', partId]));
}
