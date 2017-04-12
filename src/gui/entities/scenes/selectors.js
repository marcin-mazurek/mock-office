// eslint-disable-next-line import/prefer-default-export
export const getScene = (state, props) => state.getIn(['scenes', props.id]);
