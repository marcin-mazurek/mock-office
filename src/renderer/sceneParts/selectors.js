export default (state, sceneId) =>
  state.getIn(['scenes', sceneId]).get('parts')
    .map(partId => state.getIn(['sceneParts', 'entities', partId]));
