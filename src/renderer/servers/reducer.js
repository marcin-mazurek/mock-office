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

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      let newState = state;
      const server = new Server({
        id: action.id,
        name: action.name,
        port: action.port,
        type: action.serverType
      });
      newState = newState.setIn(['entities', action.id], server);
      newState = newState.update('ids', ids => ids.push(action.id));
      return newState;
    }
    case SELECT: {
      return state.set('selected', action.id);
    }
    case START: {
      return state.update('running', running => running.add(action.id));
    }
    case STOP: {
      return state.update('running', running => running.delete(action.id));
    }
    case REMOVE: {
      let newState = state.update('ids', ids => ids.filter(id => id !== action.id));
      newState = newState.deleteIn(['entities', action.id]);

      if (state.get('selected') === action.id) {
        newState = newState.set('selected', null);
      }
      return newState;
    }
    default: {
      return state;
    }
  }
};
