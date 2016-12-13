import { List } from 'immutable';

const initialState = new List();

export default (state = initialState, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};
