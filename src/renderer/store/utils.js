import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = fromJS({
  locationBeforeTransitions: null
});

export default (state = initialState, scene) => {
  if (scene.type === LOCATION_CHANGE) {
    return state.merge({
      locationBeforeTransitions: scene.payload
    });
  }

  return state;
};
