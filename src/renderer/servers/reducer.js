import { Record, Map, Set } from 'immutable';
import R, { __ as argPlaceholder } from 'ramda';
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
      const constructServer = R.construct(Server);
      const getConstructArgs = R.pick(['name', 'port', 'id', 'serverType']);
      const createServerFromAction = R.pipe(
        getConstructArgs,
        constructServer
      );
      const getOldItems = R.invoker(1, 'get')('itemsById');
      const addNewItem = R.invoker(2, 'set')(action.id, createServerFromAction(action));
      const updateState = R.invoker(2, 'set')('itemsById', argPlaceholder, state);

      return R.pipe(
        getOldItems,
        addNewItem,
        updateState
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
