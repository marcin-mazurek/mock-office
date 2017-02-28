import { combineReducers } from 'redux-immutable';
import routingReducer from './utils';
import serversReducer from '../servers/reducer';
import queuesReducer from '../queues/reducer';
import tasksReducer from '../tasks/reducer';

export default combineReducers({
  routing: routingReducer,
  servers: serversReducer,
  queues: queuesReducer,
  tasks: tasksReducer
});
