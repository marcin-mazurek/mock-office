import { combineReducers } from 'redux-immutable';
import expectationsReducer from '../expectations';
import routingReducer from './utils';
import serversReducer from '../servers/reducer';
import serverScriptsReducer from '../serverScripts/reducer';

export default combineReducers({
  expectations: expectationsReducer,
  routing: routingReducer,
  servers: serversReducer,
  serverScripts: serverScriptsReducer
});
