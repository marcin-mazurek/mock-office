import { Map, List, Record } from 'immutable';
import { createSelector } from 'reselect';
import unique from 'cuid';
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
import { NOTIFICATION_CLICKED, createNotificationsListConnect } from './NotificationsList';
import createReduxModule from '../utils/createReduxModule';

export const Notification = new Record({
  id: '',
  text: '',
  type: 'info'
});

const createNotification = (params) => {
  const config = {};

  config.id = unique();
  switch (params.type) {
    case 'error': {
      config.type = 'error';
      break;
    }
    case 'success': {
      config.type = 'success';
      break;
    }
    default: {
      config.type = 'info';
    }
  }
  config.text = params.text;

  return new Notification(config);
};

const initialState = new Map({
  entities: new Map(),
  ids: new List()
});

const reducers = {
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
};
const showError = (state, action, partialReducers) =>
  partialReducers.addNotification(state, { type: 'error', text: action.reason });
const showAddMockSuccess = (state, action, partialReducers) =>
  partialReducers.addNotification(state, { type: 'success', text: 'Mock added' });

const selectors = {
  allNotificationsSelector: createSelector(
    state => state.get('ids'),
    state => state.get('entities'),
    (ids, entities) => ids.map(id => entities.get(id))
  )
};
const stateGetter = state => state.get('notifications');
const components = {
  NotificationsListConnect: createNotificationsListConnect
};
const actionHandlers = {
  [ADD_SERVER_DID_SUCCEED]: (state, action, partialReducers) =>
    partialReducers.addNotification(state, { type: 'success', text: 'Server added' }),
  [REMOVE_SERVER_DID_SUCCEED]: (state, action, partialReducers) =>
    partialReducers.addNotification(state, { type: 'success', text: 'Server removed' }),
  [EDIT_SERVER_DID_FAIL]: showError,
  [REMOVE_SERVER_DID_FAIL]: showError,
  [REMOVE_MOCK_DID_FAIL]: showError,
  [IMPORT_MOCKS_FAILED]: showError,
  [ADD_HTTP_MOCK_FAILED]: showError,
  [ADD_WS_MOCK_FAILED]: showError,
  [ADD_SERVER_FAILED]: showError,
  [START_SERVER_FAILED]: showError,
  [IMPORT_MOCKS_SUCCEEDED]: (state, action, partialReducers) =>
    partialReducers.addNotification(state, { type: 'success', text: 'Mocks imported' }),
  [ADD_HTTP_MOCK_SUCCEED]: showAddMockSuccess,
  [ADD_WS_MOCK_SUCCEED]: showAddMockSuccess,
  [NOTIFICATION_CLICKED]: (state, action, partialReducers) =>
    partialReducers.removeNotification(state, action.id)
};

export default createReduxModule(
  {
    initialState,
    reducers,
    selectors
  }
)(
  actionHandlers,
  stateGetter,
  components
);
