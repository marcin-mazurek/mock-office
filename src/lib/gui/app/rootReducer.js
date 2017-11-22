import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import routingReducer from './routing/utils';
import { reducer as entitiesReducer } from '../app/entities';
import notificationsReducer from './notifications';
import { reducer as sidebarReducer } from './sidebar';
import modalReducer from './modal';
import addBehaviourReducer from './addBehaviour';

export default combineReducers({
  routing: routingReducer,
  entities: entitiesReducer,
  notifications: notificationsReducer,
  form: formReducer,
  sidebar: sidebarReducer,
  modal: modalReducer,
  addBehaviour: addBehaviourReducer
});
