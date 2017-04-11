import { List } from 'immutable';
import AppError from './AppError';
import { ADD } from './actions';

const initialState = new List();

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      return state.push(new AppError(action.reason));
    }
    case 'errors/REMOVE': {
      return state.filter(error => error.id !== action.id);
    }
    default: {
      return state;
    }
  }
};
