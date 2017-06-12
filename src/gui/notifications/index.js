import {
  SUCCEED as ADD_SERVER_DID_SUCCEED,
  FAILED as ADD_SERVER_FAILED
} from '../servers/addServer/epics';
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
import {
  FAILED as START_SERVER_FAILED
} from '../servers/startServer/epics';
import { NOTIFICATION_CLICKED } from './NotificationsList';
import notificationsReduxModule from './notificationsReduxModule';
import createNotificationsListConnect from './createNotificationsListConnect';

const showError = (state, action, reducers) =>
  reducers.addNotification(state, { type: 'error', text: action.reason });
const showAddMockSuccess = (state, action, reducers) =>
  reducers.addNotification(state, { type: 'success', text: 'Mock added' });

const notifications = notificationsReduxModule(
  {
    [ADD_SERVER_DID_SUCCEED]: (state, action, reducers) =>
      reducers.addNotification(state, { type: 'success', text: 'Server added' }),
    [REMOVE_SERVER_DID_SUCCEED]: (state, action, reducers) =>
      reducers.addNotification(state, { type: 'success', text: 'Server removed' }),
    [EDIT_SERVER_DID_FAIL]: showError,
    [REMOVE_SERVER_DID_FAIL]: showError,
    [REMOVE_MOCK_DID_FAIL]: showError,
    [IMPORT_MOCKS_FAILED]: showError,
    [ADD_HTTP_MOCK_FAILED]: showError,
    [ADD_WS_MOCK_FAILED]: showError,
    [ADD_SERVER_FAILED]: showError,
    [START_SERVER_FAILED]: showError,
    [IMPORT_MOCKS_SUCCEEDED]: (state, action, reducers) =>
      reducers.addNotification(state, { type: 'success', text: 'Mocks imported' }),
    [ADD_HTTP_MOCK_SUCCEED]: showAddMockSuccess,
    [ADD_WS_MOCK_SUCCEED]: showAddMockSuccess,
    [NOTIFICATION_CLICKED]: (state, action, reducers) =>
      reducers.removeNotification(state, action.id)
  },
  state => state.get('notifications')
);

export const reducer = notifications.reducer;
export const selectors = notifications.selectors;
export const NotificationsListConnect = createNotificationsListConnect(notifications.selectors);