import { Map, Record } from 'immutable';
import { REMOVE } from './removeScene/actions';
import { ADD } from './addScene/actions';

const initialState = new Map();
const Scene = new Record({
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
      const { id } = action;
      const sceneConfig = Object.keys(action).reduce((acc, next) => {
        const cfg = acc;
        if (action[next]) {
          cfg[next] = action[next];
        }

        return cfg;
      }, {});
      const scene = new Scene(sceneConfig);

      return state.set(id, scene);
    }
    case REMOVE: {
      return state.remove(action.sceneId);
    }
    default: {
      return state;
    }
  }
};
