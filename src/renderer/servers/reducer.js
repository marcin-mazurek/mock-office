import { Record, Map, Set } from 'immutable';
import {
  ADD,
  SELECT,
  START,
  STOP
} from './actions';

const Server = new Record({
  id: '',
  name: 'New Server',
  port: null,
  expectations: new Set(),
  type: ''
});

const initialState = new Map({
  itemsById: new Map(),
  selected: null,
  running: new Set()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { name, port, id, serverType } = action;
      const server = new Server({ name, port, id, type: serverType });
      const newItemsById = state.get('itemsById').set(id, server);

      return state.set('itemsById', newItemsById);
    }
    case SELECT: {
      const { id } = action;
      return state.set('selected', id);
    }
    case START: {
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
