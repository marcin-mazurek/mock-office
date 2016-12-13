export const getUnloadedMocks = (state) => {
  const mocksById = state.getIn(['mocks', 'itemsById']);
  const expOnIds = state.getIn(['mocks', 'unloadedIds']);
  return expOnIds.map(id => mocksById.get(id));
};

export const getLoadedMocks = (state) => {
  const mocksById = state.getIn(['mocks', 'itemsById']);
  const expOnIds = state.getIn(['mocks', 'loadedIds']);
  return expOnIds.map(id => mocksById.get(id));
};
