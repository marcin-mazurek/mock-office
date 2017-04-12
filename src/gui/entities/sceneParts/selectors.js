export default (state, props) =>
  state.getIn(['scenes', props.sceneId]).get('parts');
export const getScenePart = (state, props) =>
  state.getIn(['sceneParts', 'entities', props.id]);
