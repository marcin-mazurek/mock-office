/* eslint-disable import/prefer-default-export */
import { createSelector } from 'reselect';

export const allNotificationsSelector = createSelector(
  state => state.getIn(['notifications', 'ids']),
    state => state.get('entities'),
    (ids, entities) => ids.map(id => entities.get(id))
);
