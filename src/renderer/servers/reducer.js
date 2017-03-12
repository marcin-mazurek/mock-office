import { Record, Map, Set } from 'immutable';
import { ADD, SELECT, START, STOP } from './actions';

export const Server = new Record({
  id: '',
  name: 'New Server',
  port: null,
  type: ''
});

const initialState = new Map({
  entities: new Map(),
  ids: new Set(),
  selected: null,
  running: new Set()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      let newState = state;
      newState = newState.setIn(['entities', action.id], new Server({
        id: action.id,
        name: action.name,
        port: action.port,
        type: action.serverType
      }));
      newState = newState.update('ids', ids => ids.add(action.id));
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
    default: {
      return state;
    }
  }
};
