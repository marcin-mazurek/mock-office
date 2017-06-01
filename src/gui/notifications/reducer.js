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
import {
  SUCCEEDED as IMPORT_MOCKS_SUCCEEDED,
  FAILED as IMPORT_MOCKS_FAILED
} from '../mocks/importMock/epics';
import {
  SUCCEED as ADD_HTTP_MOCK_SUCCEED,
  FAILED as ADD_HTTP_MOCK_FAILED
} from '../mocks/addMock/addHttpMock/epic';
import {
  SUCCEED as ADD_WS_MOCK_SUCCEED,
  FAILED as ADD_WS_MOCK_FAILED
} from '../mocks/addMock/addWsMock/epic';

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
    case REMOVE_SERVER_DID_SUCCEED: {
      return addNotification(state, createNotification({ type: 'success', text: 'Server removed' }));
    }
    case EDIT_SERVER_DID_FAIL:
    case REMOVE_SERVER_DID_FAIL:
    case REMOVE_MOCK_DID_FAIL:
    case IMPORT_MOCKS_FAILED:
    case ADD_HTTP_MOCK_FAILED:
    case ADD_WS_MOCK_FAILED:
    case ADD_SERVER_FAILED: {
      return addNotification(state, createNotification({ type: 'error', text: action.reason }));
    }
    case IMPORT_MOCKS_SUCCEEDED: {
      return addNotification(state, createNotification({ type: 'success', text: 'Mocks imported' }));
    }
    case ADD_HTTP_MOCK_SUCCEED:
    case ADD_WS_MOCK_SUCCEED: {
      return addNotification(state, createNotification({ type: 'success', text: 'Mock added' }));
    }
    default: {
      return state;
    }
  }
}
