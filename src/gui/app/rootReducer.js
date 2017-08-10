import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import routingReducer from './router/utils';
import { reducer as entitiesReducer } from '../app/entities';
import { reducer as notificationsReducer } from '../notifications';
import { reducer as sidebarReducer } from '../sidebar/sidebarModule';
import { reducer as modalReducer } from '../app/modal';
import { reducer as addMockReducer } from '../mocks/addMock';

export default combineReducers({
  routing: routingReducer,
  entities: entitiesReducer,
  notifications: notificationsReducer,
  form: formReducer,
  sidebar: sidebarReducer,
  modal: modalReducer,
  addMock: addMockReducer
});