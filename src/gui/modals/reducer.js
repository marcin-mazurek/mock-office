import { Record } from 'immutable';
import { OPEN, CLOSE } from './actions';

const InitialState = new Record({
  component: ''
});

export default function addServerReducer(state = new InitialState(), action) {
  switch (action.type) {
    case OPEN: {
      return state
        .set('component', action.component);
    }
    case CLOSE: {
      return state
        .delete('component');
    }
    default: {
      return state;
    }
  }
}
