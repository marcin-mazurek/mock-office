import { Record } from 'immutable';
import { OPEN_MODAL, CLOSE_MODAL } from './actions';

const InitialState = new Record({
  isOpen: false
});

export default function addServerReducer(state = new InitialState(), action) {
  switch (action.type) {
    case OPEN_MODAL: {
      return state.set('isOpen', true);
    }
    case CLOSE_MODAL: {
      return state.set('isOpen', false);
    }
    default: {
      return state;
    }
  }
}
