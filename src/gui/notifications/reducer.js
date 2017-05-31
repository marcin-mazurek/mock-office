import { Map, List, Record } from 'immutable';
import createNotification from './createNotification';
import { REMOVE, ADD } from './actions';
import { SUCCEED as ADD_SERVER_SUCCEED, FAILED as ADD_SERVER_FAILED } from '../servers/addServer/epics';
import { DID_FAIL as EDIT_SERVER_DID_FAIL } from '../servers/editServer/epics';
import {
  DID_FAIL as REMOVE_SERVER_DID_FAIL,
  DID_SUCCEED as REMOVE_SERVER_DID_SUCCEED
} from '../servers/removeServer/epics';
import { DID_FAIL as REMOVE_MOCK_DID_FAIL } from '../mocks/removeMock/epics';

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
    case EDIT_SERVER_DID_FAIL: {
      return addNotification(state, action.reason);
    }
    case REMOVE_SERVER_DID_SUCCEED: {
      return addNotification(state, createNotification({ type: 'success', text: 'Server removed' }));
    }
    case REMOVE_SERVER_DID_FAIL: {
      return addNotification(state, createNotification({ type: 'error', text: action.reason }));
    }
    case REMOVE_MOCK_DID_FAIL: {
      return addNotification(state, createNotification({ type: 'error', text: action.reason }));
    }
    default: {
      return state;
    }
  }
}
