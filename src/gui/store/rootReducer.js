import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import routingReducer from './utils';
import serversReducer from '../entities/servers/reducer';
import scenariosReducer from '../entities/scenarios/reducer';
import mocksReducer from '../entities/mocks/reducer';
import tasksReducer from '../entities/tasks/reducer';
import notificationsReducer from '../entities/notifications/reducer';
import sidebarReducer from '../sidebar/reducer';
import modalsReducer from '../modals/reducer';

export default combineReducers({
  routing: routingReducer,
  servers: serversReducer,
  scenarios: scenariosReducer,
  mocks: mocksReducer,
  tasks: tasksReducer,
  notifications: notificationsReducer,
  form: formReducer,
  sidebar: sidebarReducer,
  modals: modalsReducer
});
