export default (state, props) =>
  state.getIn(['mocks', props.mockId]).get('tasks');
export const getTask = (state, props) =>
  state.getIn(['tasks', 'entities', props.id]);
