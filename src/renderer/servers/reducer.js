import { Record, Map, List, Set } from 'immutable';
import { ADD, SELECT, START, STOP, REMOVE } from './actions';

export const Server = new Record({
  id: '',
  name: 'New Server',
  port: null,
  type: ''
});

const initialState = new Map({
  entities: new Map(),
  ids: new List(),
  selected: null,
  running: new Set()
});

export default (state = initialState, scene) => {
  switch (scene.type) {
    case ADD: {
      let newState = state;
      const server = new Server({
        id: scene.id,
        name: scene.name,
        port: scene.port,
        type: scene.serverType
      });
      newState = newState.setIn(['entities', scene.id], server);
      newState = newState.update('ids', ids => ids.push(scene.id));
      return newState;
    }
    case SELECT: {
      return state.set('selected', scene.id);
    }
    case START: {
      return state.update('running', running => running.add(scene.id));
    }
    case STOP: {
      return state.update('running', running => running.delete(scene.id));
    }
    case REMOVE: {
      let newState = state.update('ids', ids => ids.filter(id => id !== scene.id));
      newState = newState.deleteIn(['entities', scene.id]);

      if (state.get('selected') === scene.id) {
        newState = newState.set('selected', null);
      }
      return newState;
    }
    default: {
      return state;
    }
  }
};
