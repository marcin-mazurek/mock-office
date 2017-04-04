import { List } from 'immutable';
import AppError from './AppError';
import { ADD } from './actions';

const initialState = new List();

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      let newState = state;
      newState = newState.push(new AppError({ reason: action.reason }));
      return newState;
    }
    default: {
      return state;
    }
  }
};
