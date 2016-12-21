import { createSelector } from 'reselect';
import { List } from 'immutable';
import { getSelected } from '../servers/selectors';

export const getAll = state => state.getIn(['mocks', 'itemsById']);
export const getAllAsList = createSelector(
  getAll,
  all => all.toList()
);
export const getAllLoaded = state => state.getIn(['mocks', 'loadedByServer']);

export const getLoadedByServer = createSelector(
  getAll,
  getAllLoaded,
  getSelected,
  (all, loadedIds, selected) => (
    loadedIds.get(selected) ? loadedIds.get(selected).map(id => all.get(id)) : new List()
  )
);
