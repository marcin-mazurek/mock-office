import { combineReducers } from 'redux-immutable';
import routingReducer from './utils';
import serversReducer from '../entities/servers/reducer';
import queuesReducer from '../entities/scenarios/reducer';
import scenesReducer from '../entities/scenes/reducer';
import scenePartsReducer from '../entities/sceneParts/reducer';
import errorsReducer from '../entities/errors/reducer';
import notificationsReducer from '../entities/notifications/reducer';

export default combineReducers({
  routing: routingReducer,
  servers: serversReducer,
  queues: queuesReducer,
  scenes: scenesReducer,
  sceneParts: scenePartsReducer,
  errors: errorsReducer,
  notifications: notificationsReducer
});
