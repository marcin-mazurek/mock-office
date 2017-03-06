// eslint-disable-next-line import/prefer-default-export
export const getTask = (state, props) => state.getIn(['tasks', props.id]);
