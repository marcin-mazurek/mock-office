import { createSelector } from 'reselect';

export const getAll = state => state.getIn(['servers', 'items']);
export const getSelected = state => state.getIn(['servers', 'selected']);
export const getRunning = state => state.getIn(['servers', 'running']);
export const isRunning = createSelector(
  getSelected,
  getRunning,
  (id, running) => running.has(id)
);
