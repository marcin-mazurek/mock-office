import { createSelector } from 'reselect';

export const serverSelector = (state, id) => state.getIn(['entities', 'servers', 'entities', id]);
export const behaviourSelector = (state, id) => state.getIn(['entities', 'behaviours', 'entities', id]);
export const reactionSelector = (state, id) => state.getIn(['entities', 'reactions', 'entities', id]);
export const allServersSelector = createSelector(
  state => state.getIn(['entities', 'servers', 'ids']),
  state => state.getIn(['entities', 'servers', 'entities']),
  (ids, entities) => ids.map(id => entities.get(id))
);
