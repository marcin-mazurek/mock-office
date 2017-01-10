import { Record, Map, Set } from 'immutable';
import R from 'ramda';
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
      return R.pipe(
        R.invoker(1, 'get')('itemsById'),
        R.invoker(2, 'set')(action.id,
          R.pipe(
            R.pick(['name', 'port', 'id', 'serverType']),
            R.construct(Server)
          )
        ),
        R.invoker(2, 'set')('itemsById', R.__, state)
      )(state);
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
