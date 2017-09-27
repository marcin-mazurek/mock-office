import { createReducer } from 'notifications';
import {
  SUCCEEDED as ADD_SERVER_SUCCEEDED,
  FAILED as ADD_SERVER_FAILED
} from '../../epics/addServer/actions';
import { FAILED as EDIT_SERVER_FAILED } from '../../epics/editServer/actions';
import {
  FAILED as REMOVE_SERVER_FAILED,
  SUCCEEDED as REMOVE_SERVER_SUCCEEDED
} from '../../epics/removeServer/actions';
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
} from '../../epics/startServer/actions';
import { FAILED as STOP_SERVER_FAILED } from '../../epics/stopServer';

export default createReducer(
  {
    [ADD_HTTP_MOCK_SUCCEED]: reduce => reduce('addNotification', {
      type: 'success',
      text: 'Mock added'
    }),
    [ADD_WS_MOCK_SUCCEED]: reduce => reduce('addNotification', {
      type: 'success',
      text: 'Mock added'
    }),
    [IMPORT_MOCKS_SUCCEEDED]: reduce => reduce('addNotification', {
      type: 'success',
      text: 'Mocks imported'
    }),
    [EDIT_SERVER_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [REMOVE_SERVER_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [REMOVE_MOCK_DID_FAIL]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [IMPORT_MOCKS_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [ADD_HTTP_MOCK_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [ADD_WS_MOCK_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [ADD_SERVER_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [START_SERVER_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [STOP_SERVER_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [REMOVE_SERVER_SUCCEEDED]: reduce => reduce('addNotification', {
      type: 'success',
      text: 'Server removed'
    }),
    [ADD_SERVER_SUCCEEDED]: reduce => reduce('addNotification', {
      type: 'success',
      text: 'Server added'
    })
  },
  true
);
