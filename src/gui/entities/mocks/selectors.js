// eslint-disable-next-line import/prefer-default-export
export const mockSelector = (state, id) => state.getIn(['mocks', 'entities', id]);
