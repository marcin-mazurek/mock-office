import { List } from 'immutable';
import AppError from './AppError';
import { ADD } from './actions';

const initialState = new List();

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      return state.concat(new List(action.reasons.map(reason => new AppError(reason))));
    }
    case 'errors/REMOVE': {
      return state.filter(error => error.id !== action.id);
    }
    default: {
      return state;
    }
  }
};
