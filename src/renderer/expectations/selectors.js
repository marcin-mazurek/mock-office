import { List } from 'immutable';
import { createSelector } from 'reselect';
import { getSelected } from '../servers/selectors';

export const getAll = state => state.getIn(['expectations', 'itemsById']);
export const getItemsByServer = state => state.getIn(['expectations', 'itemsByServer']);
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
export const getLoaded = state => state.getIn(['expectations', 'loaded']);
export const getSelectedServerLoadedExpectations = createSelector(
  getLoaded,
  getAll,
  (loadedExpectations, allExpectations) => (
    loadedExpectations.map(exp => ({
      instanceId: exp.instanceId,
      expectation: allExpectations.get(exp.expectationId),
      quantity: exp.quantity
    }))
  )
);

export const getExpectation = (state, id) => state.getIn(['expectations', 'itemsById', id]);
