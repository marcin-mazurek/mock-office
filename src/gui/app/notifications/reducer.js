import { List, Map } from 'immutable';
import { createNotification } from './createNotification';
import { ADD } from './actions';
import {
  SUCCEEDED as ADD_SERVER_DID_SUCCEED,
  FAILED as ADD_SERVER_FAILED
} from '../../servers/addServer/epics';
import { FAILED as EDIT_SERVER_DID_FAIL } from '../../servers/editServer/epics';
import {
  FAILED as REMOVE_SERVER_DID_FAIL,
  SUCCEEDED as REMOVE_SERVER_DID_SUCCEED
} from '../../servers/removeServer/epics';
import { DID_FAIL as REMOVE_MOCK_DID_FAIL } from '../../epics/removeMock';
import {
  SUCCEEDED as IMPORT_MOCKS_SUCCEEDED,
  FAILED as IMPORT_MOCKS_FAILED
} from '../../epics/importMock';
import {
  SUCCEED as ADD_HTTP_MOCK_SUCCEED,
  FAILED as ADD_HTTP_MOCK_FAILED
} from '../../epics/addHttpMock';
import {
  SUCCEED as ADD_WS_MOCK_SUCCEED,
  FAILED as ADD_WS_MOCK_FAILED
} from '../../epics/addWsMock';
import {
  FAILED as START_SERVER_FAILED
} from '../../servers/startServer/startServer';
import { NOTIFICATION_CLICKED } from '../../components/NotificationsList';
import { FAILED as STOP_SERVER_FAILED } from '../../servers/stopServer';
import { NOTIFICATION_EXPIRED } from '../../epics/clearExpiredNotifications';

const initialState = new Map({
  ids: new List(),
  entities: new Map()
});

const addNotification = (state, notificationParams) => {
  const notification = createNotification(notificationParams);
  return state
    .update('entities', entities => entities.set(notification.id, notification))
    .update('ids', ids => ids.push(notification.id));
};

const removeNotification = (state, id) =>
  state
    .update('ids', ids => ids.filter(notificationId => notificationId !== id))
    .update('entities', entities => entities.delete(id));

const showError = (state, reason) =>
  addNotification(state, { type: 'error', text: reason });
const showAddMockSuccess = (state, action, reducers) =>
  reducers.addNotification(state, { type: 'success', text: 'Mock added' });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      return addNotification(state, action.params);
    }
    case ADD_SERVER_DID_SUCCEED: {
      return addNotification(state, { type: 'success', text: 'Server added' });
    }

    case REMOVE_SERVER_DID_SUCCEED: {
      return addNotification(state, { type: 'success', text: 'Server removed' });
    }
    case EDIT_SERVER_DID_FAIL:
    case REMOVE_SERVER_DID_FAIL:
    case REMOVE_MOCK_DID_FAIL:
    case IMPORT_MOCKS_FAILED:
    case ADD_HTTP_MOCK_FAILED:
    case ADD_WS_MOCK_FAILED:
    case ADD_SERVER_FAILED:
    case START_SERVER_FAILED:
    case STOP_SERVER_FAILED: {
      return showError(state, action.reason);
    }
    case IMPORT_MOCKS_SUCCEEDED: {
      return addNotification(state, { type: 'success', text: 'Mocks imported' });
    }
    case ADD_HTTP_MOCK_SUCCEED: {
      return showAddMockSuccess(state, action);
    }
    case ADD_WS_MOCK_SUCCEED: {
      return showAddMockSuccess(state, action);
    }
    case NOTIFICATION_CLICKED: {
      return removeNotification(state, action.id);
    }
    case NOTIFICATION_EXPIRED: {
      return removeNotification(state, action.id);
    }
    default: {
      return state;
    }
  }
};

export default reducer;
