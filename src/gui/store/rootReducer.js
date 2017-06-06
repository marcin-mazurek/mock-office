import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import routingReducer from './utils';
import entitiesReducer from '../entities/reducer';
import notificationsModule from '../notifications';
import sidebarReducer from '../sidebar/reducer';
import modalsModule from '../modals';

export default combineReducers({
  routing: routingReducer,
  entities: entitiesReducer,
  notifications: notificationsModule.reducer,
  form: formReducer,
  sidebar: sidebarReducer,
  modals: modalsModule.reducer
});
