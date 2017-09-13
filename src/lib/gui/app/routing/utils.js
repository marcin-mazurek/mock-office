import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = fromJS({
  locationBeforeTransitions: null
});

export default (state = initialState, mock) => {
  if (mock.type === LOCATION_CHANGE) {
    return state.merge({
      locationBeforeTransitions: mock.payload
    });
  }

  return state;
};
