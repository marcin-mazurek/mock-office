import { Map, List } from 'immutable';
import { createSelector } from 'reselect';
import createReduxModule from '../utils/createReduxModule';
import { createNotification } from './createNotification';

export default createReduxModule(
  {
    initialState: new Map({
      entities: new Map(),
      ids: new List()
    }),
    reducers: {
      addNotification(state, notificationParams) {
        const notification = createNotification(notificationParams);
        return state
          .update('entities', entities => entities.set(notification.id, notification))
          .update('ids', ids => ids.push(notification.id));
      },
      removeNotification(state, id) {
        return state
          .update('ids', ids => ids.filter(notificationId => notificationId !== id))
          .update('entities', entities => entities.delete(id));
      }
    },
    selectors: {
      allNotificationsSelector: createSelector(
        state => state.get('ids'),
        state => state.get('entities'),
        (ids, entities) => ids.map(id => entities.get(id))
      )
    }
  }
);
