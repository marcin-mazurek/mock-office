import { combineReducers } from 'redux-immutable';
import routingReducer from './utils';
import serversReducer from '../servers/reducer';
import queuesReducer from '../scenarios/reducer';
import descriptionsReducer from '../descriptions/reducer';

export default combineReducers({
  routing: routingReducer,
  servers: serversReducer,
  queues: queuesReducer,
  descriptions: descriptionsReducer
});
