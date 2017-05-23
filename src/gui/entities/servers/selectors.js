import { createSelector } from 'reselect';

export const serverSelector = (state, id) => state.getIn(['servers', 'entities', id]);
export const allServerSelector = createSelector(
  state => state.getIn(['servers', 'ids']),
  state => state.getIn(['servers', 'entities']),
  (ids, entities) => ids.map(id => entities.get(id))
);
