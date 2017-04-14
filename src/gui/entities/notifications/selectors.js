import { createSelector } from 'reselect';

// eslint-disable-next-line import/prefer-default-export
export const getNotifications = createSelector(
  state => state.getIn(['notifications', 'ids']),
  state => state.getIn(['notifications', 'entities']),
  (ids, entities) => ids.map(id => entities.get(id))
);
