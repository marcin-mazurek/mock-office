import { List, Map } from 'immutable';
import { ADD } from '../../scenes/addScene/actions';
import ScenePart from './ScenePart';

const initialState = new Map({
  ids: new List(),
  entities: new Map()
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
            Object.assign({ id: part.id }, part)
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
