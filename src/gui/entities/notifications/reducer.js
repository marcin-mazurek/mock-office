import { Map, List, Record } from 'immutable';
import createNotification from './createNotification';
import { REMOVE, ADD } from './actions';
import { SUCCEED as ADD_SERVER_SUCCEED, FAILED as ADD_SERVER_FAILED } from '../../servers/addServer/epics';
import { DID_FAIL } from '../../servers/editServer/epics';

export const NotificationsState = new Record({
  entities: new Map(),
  ids: new List()
});

const addNotification = (state, notification) =>
  state
  .update('entities', entities => entities.set(notification.id, notification))
  .update('ids', ids => ids.push(notification.id));

// notificationsReducer :: (NotificationsState, Object) -> NotificationsState
export default function notificationsReducer(state = new NotificationsState(), action) {
  switch (action.type) {
    case ADD: {
      return addNotification(state, createNotification(action.notification));
    }
    case REMOVE: {
      return state
        .update('ids', ids => ids.filter(id => id !== action.id))
        .update('entities', entities => entities.delete(action.id));
    }
    case ADD_SERVER_SUCCEED: {
      return addNotification(state, createNotification({ type: 'success', text: 'Server added' }));
    }
    case ADD_SERVER_FAILED: {
      return addNotification(state, createNotification({ type: 'error', text: action.params.error }));
    }
    case DID_FAIL: {
      return addNotification(state, action.reason);
    }
    default: {
      return state;
    }
  }
}
