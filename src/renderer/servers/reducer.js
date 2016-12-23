import { Record, Map, Set } from 'immutable';
import {
  ADD,
  SELECT,
  START_SERVER,
  STOP
} from './actions';

const Server = new Record({
  id: '',
  name: 'New Server',
  port: 3000,
  expectations: new Set()
});

const initialState = new Map({
  itemsById: new Map(),
  selected: null,
  running: new Set()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { name, port, id } = action;
      const server = new Server({ name, port, id });

      return state.set('itemsById',
        state.get('itemsById').set(id, server)
      );
    }
    case SELECT: {
      const { id } = action;
      return state.set('selected', id);
    }
    case START_SERVER: {
      const { id } = action;
      return state.set('running', state.get('running').add(id));
    }
    case STOP: {
      const { id } = action;
      return state.set('running', state.get('running').delete(id));
    }
    default: {
      return state;
    }
  }
};
