import { createSelector } from 'reselect';
import { Server } from './recordTypes';

export const serverSelector = (state, id) => state.getIn(['entities', 'servers', 'entities', id]);
export const mockSelector = (state, id) => state.getIn(['entities', 'mocks', 'entities', id]);
export const taskSelector = (state, id) => state.getIn(['entities', 'tasks', 'entities', id]);
export const scenarioSelector = (state, id) => state.getIn(['entities', 'scenarios', 'entities', id]);
export const allServersSelector = createSelector(
  state => state.getIn(['entities', 'servers', 'ids']),
  state => state.getIn(['entities', 'servers', 'entities']),
  (ids, entities) =>
    ids
      .map(id => entities.get(id))
      .filter(entity => entity instanceof Server)
);
