export const taskSelector = (state, id) =>
  state.getIn(['tasks', 'entities', id]);
