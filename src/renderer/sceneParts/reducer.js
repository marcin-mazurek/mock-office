import { Record, List, Map } from 'immutable';
import { ADD } from '../scenes/addScene/actions';

const initialState = new Map({
  ids: new List(),
  entities: new Map()
});

export const ScenePart = new Record({
  title: '',
  id: '',
  interval: null,
  reuse: null,
  quantity: null,
  delay: null,
  requirements: null
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      let newState = state;
      action.parts.forEach((part) => {
        newState = newState.update('ids', ids => ids.push(part.id));
        newState = newState.setIn(
          ['entities', part.id],
          new ScenePart(
            Object.assign({ id: part.id }, part.scheduleDetails)
          )
        );
      });
      return newState;
    }
    default: {
      return state;
    }
  }
};
