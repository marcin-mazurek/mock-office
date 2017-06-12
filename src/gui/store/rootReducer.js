import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import routingReducer from './utils';
import entitiesReducer from '../entities/reducer';
import { reducer as notificationsReducer } from '../notifications';
import { reducer as sidebarReducer } from '../sidebar/sidebarModule';
import { reducer as modalsReducer } from '../modals';

export default combineReducers({
  routing: routingReducer,
  entities: entitiesReducer,
  notifications: notificationsReducer,
  form: formReducer,
  sidebar: sidebarReducer,
  modals: modalsReducer
});
