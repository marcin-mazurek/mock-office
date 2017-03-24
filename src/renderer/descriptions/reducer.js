import { Map, Record } from 'immutable';
import { REMOVE } from './removeDescription/actions';
import { ADD } from './addDescription/actions';

const initialState = new Map();
const Description = new Record({
  title: '',
  descriptionPayload: {},
  id: '',
  interval: null,
  reuse: null,
  quantity: null,
  delay: null,
  requirements: null,
  blocking: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { id } = action;
      const descriptionConfig = Object.keys(action).reduce((acc, next) => {
        const cfg = acc;
        if (action[next]) {
          cfg[next] = action[next];
        }

        return cfg;
      }, {});
      const description = new Description(descriptionConfig);

      return state.set(id, description);
    }
    case REMOVE: {
      return state.remove(action.descriptionId);
    }
    default: {
      return state;
    }
  }
};
