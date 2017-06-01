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
import {
  FAILED as START_SERVER_FAILED
} from '../servers/startServer/epics';
import { configureReducer, configureSelectors } from './module';

const showError = (action, reducers, state) =>
  reducers.addNotification(state, { type: 'error', text: action.reason });
const showAddMockSuccess = (action, reducers, state) =>
  reducers.addNotification(state, { type: 'success', text: 'Mock added' });

const reducer = configureReducer({
  [ADD_SERVER_SUCCEED]: (action, reducers, state) =>
    reducers.addNotification(state, { type: 'success', text: 'Server added' }),
  [REMOVE_SERVER_DID_SUCCEED]: (action, reducers, state) =>
    reducers.addNotification(state, { type: 'success', text: 'Server removed' }),
  [EDIT_SERVER_DID_FAIL]: showError,
  [REMOVE_SERVER_DID_FAIL]: showError,
  [REMOVE_MOCK_DID_FAIL]: showError,
  [IMPORT_MOCKS_FAILED]: showError,
  [ADD_HTTP_MOCK_FAILED]: showError,
  [ADD_WS_MOCK_FAILED]: showError,
  [ADD_SERVER_FAILED]: showError,
  [START_SERVER_FAILED]: showError,
  [IMPORT_MOCKS_SUCCEEDED]: (action, reducers, state) =>
    reducers.addNotification(state, { type: 'success', text: 'Mocks imported' }),
  [ADD_HTTP_MOCK_SUCCEED]: showAddMockSuccess,
  [ADD_WS_MOCK_SUCCEED]: showAddMockSuccess
});
export const selectors = configureSelectors(state => state.get('notifications'));
export default reducer;
