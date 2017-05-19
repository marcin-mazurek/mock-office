// eslint-disable-next-line import/prefer-default-export
import { createSelector } from 'reselect';

export const getTasks = (state, mockId) => state.getIn(['mocks', mockId, 'tasks']);
export const mocksIdsSelector = state => state.getIn(['mocks', 'ids']);
export const mockEntitiesSelector = state => state.getIn(['mocks', 'entities']);
export const allMocksSelector = createSelector(
  mocksIdsSelector,
  mockEntitiesSelector,
  (ids, entities) => mocksIdsSelector.map(id => entities.get(id))
);
export const mockSelector = (state, id) => state.getIn(['mocks', 'entities', id]);

