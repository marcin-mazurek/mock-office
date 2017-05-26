import { Record } from 'immutable';
import { OPEN, CLOSE } from './actions';
import { SUCCEED as ADD_SERVER_SUCCEED } from '../servers/addServer/actions';
import { ADD_BUTTON_CLICKED } from '../sidebar/actions';

const InitialState = new Record({
  component: ''
});

const openModal = (state, component) => state.set('component', component);
const closeModal = state => state.delete('component');

export default function addServerReducer(state = new InitialState(), action) {
  switch (action.type) {
    case OPEN: {
      return openModal(state, action.component);
    }
    case CLOSE: {
      return closeModal(state);
    }
    case ADD_SERVER_SUCCEED: {
      return closeModal(state);
    }
    case ADD_BUTTON_CLICKED: {
      return openModal(state, 'addServerModal');
    }
    default: {
      return state;
    }
  }
}
