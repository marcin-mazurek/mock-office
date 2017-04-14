import { Map, List, Record } from 'immutable';
import createNotification from './createNotification';

export const NotificationsState = new Record({
  entities: new Map(),
  ids: new List()
});

// notificationsReducer :: (NotificationsState, Object) -> NotificationsState
export default function notificationsReducer(state = new NotificationsState(), action) {
  switch (action.type) {
    case 'notifications/ADD': {
      let newState = state;

      try {
        const notification = createNotification(action.notification);
        newState = newState
          .update('entities', entities => entities.set(notification.id, notification))
          .update('ids', ids => ids.push(notification.id));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }

      return newState;
    }
    case 'notifications/REMOVE': {
      return state
        .update('ids', ids => ids.filter(id => id !== action.id))
        .update('entities', entities => entities.delete(action.id));
    }
    default: {
      return state;
    }
  }
}
