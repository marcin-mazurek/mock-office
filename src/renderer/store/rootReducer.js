import { combineReducers } from 'redux-immutable';
import mocksReducer from '../mocks';
import routingReducer from './utils';
import serversReducer from '../servers/reducer';

export default combineReducers({
  mocks: mocksReducer,
  routing: routingReducer,
  servers: serversReducer
});
