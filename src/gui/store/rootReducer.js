import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import routingReducer from './utils';
import { reducer as entitiesReducer } from '../appModules/entities';
import { reducer as notificationsReducer } from '../notifications';
import { reducer as sidebarReducer } from '../sidebar/sidebarModule';
import { reducer as modalReducer } from '../appModules/modal';
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
