/* eslint-disable import/prefer-default-export */
import { createSelector } from 'reselect';

export const allNotificationsSelector = createSelector(
  state => state.get('notifications').ids,
  state => state.get('notifications').entities,
  (ids, entities) => ids.map(id => entities[id])
);
