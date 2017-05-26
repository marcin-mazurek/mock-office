import { Record } from 'immutable';
import { OPEN, CLOSE } from './actions';
import { SUCCEED as ADD_SERVER_SUCCEED } from '../servers/addServer/actions';

const InitialState = new Record({
  component: ''
});

const closeModal = state => state.delete('component');

export default function addServerReducer(state = new InitialState(), action) {
  switch (action.type) {
    case OPEN: {
      return state
        .set('component', action.component);
    }
    case CLOSE: {
      return closeModal(state);
    }
    case ADD_SERVER_SUCCEED: {
      return closeModal(state);
    }
    default: {
      return state;
    }
  }
}
