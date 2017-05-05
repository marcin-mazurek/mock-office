// eslint-disable-next-line import/prefer-default-export
export const getMock = (state, props) => state.getIn(['mocks', props.id]);
export const getTasks = (state, mockId) => state.getIn(['mocks', mockId, 'tasks']);
