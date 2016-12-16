import { List, Record, Map } from 'immutable';
import unique from 'node-unique';
import { ADD, SELECT } from './actions';

const Server = new Record({
  id: '',
  name: 'New Server',
  port: 3000
});

const initialState = new Map({
  items: new List(),
  selected: null
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { name, port } = action;
      const server = new Server({ name, port, id: unique() });
      let items = state.get('items');
      items = items.push(server);
      let newState = state;
      newState = newState.set('items', items);

      return newState;
    }
    case SELECT: {
      const { id } = action;
      return state.set('selected', id);
    }
    default: {
      return state;
    }
  }
};
