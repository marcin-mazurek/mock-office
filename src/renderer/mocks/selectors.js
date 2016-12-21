import { List } from 'immutable';
import { createSelector } from 'reselect';
import { getSelected } from '../servers/selectors';

export const getAll = state => state.getIn(['mocks', 'itemsById']);
export const getItemsByServer = state => state.getIn(['mocks', 'itemsByServer']);
export const getSelectedServerExpectationsIds = createSelector(
  getItemsByServer,
  getSelected,
  (itemsByServer, selected) => itemsByServer.get(selected)
);
export const getSelectedServerExpectations = createSelector(
  getSelectedServerExpectationsIds,
  getAll,
  (ids, all) => (ids ? ids.map(id => all.get(id)) : new List())
);
export const getLoaded = state => state.getIn(['mocks', 'loaded']);
export const getSelectedServerLoadedExpectations = createSelector(
  getSelectedServerExpectationsIds,
  getLoaded,
  getAll,
  (expectations, loadedExpecationsIds, allExpectations) => (
    expectations
      ? expectations
      .filter(expId => loadedExpecationsIds.has(expId))
      .map(expId => allExpectations.get(expId))
      : new List()
  )
);
