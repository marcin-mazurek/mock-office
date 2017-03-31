import { combineReducers } from 'redux-immutable';
import routingReducer from './utils';
import serversReducer from '../servers/reducer';
import queuesReducer from '../scenarios/reducer';
import scenesReducer from '../scenes/reducer';
import scenePartsReducer from '../sceneParts/reducer';

export default combineReducers({
  routing: routingReducer,
  servers: serversReducer,
  queues: queuesReducer,
  scenes: scenesReducer,
  sceneParts: scenePartsReducer
});
