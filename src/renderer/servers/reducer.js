import { Record, Map, Set } from 'immutable';
import R from 'ramda';
import {
  ADD,
  SELECT,
  START,
  STOP
} from './actions';

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

const select = R.invoker(2, 'set')('selected');
const updateRunningServers = R.invoker(2, 'update')('running');
const addToSet = R.invoker(1, 'add');
const removeFromRunning = R.invoker(1, 'delete');

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
      return select(action.id)(state);
    }
    case START: {
      return updateRunningServers(addToSet(action.id))(state);
    }
    case STOP: {
      return updateRunningServers(removeFromRunning(action.id))(state);
    }
    default: {
      return state;
    }
  }
};
