/* eslint-disable import/prefer-default-export */
export const allNotificationsSelector = (state) => {
  const ids = state.notifications.ids;
  const entities = state.notifications.entities;

  return ids.map(id => entities[id]);
};
