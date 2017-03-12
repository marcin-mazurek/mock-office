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
  itemsById: new Map(),
  selected: null,
  running: new Set()
});

const select = R.invoker(2, 'set')('selected');
const updateRunningServers = R.invoker(2, 'update')('running');
const addToSet = R.invoker(1, 'add');
const removeFromRunning = R.invoker(1, 'delete');
const addServer = R.curry((id, server, currentState) => currentState.setIn(['itemsById', id], server));
const pickRequiredFields = R.pick(['name', 'port', 'id', 'type', 'queue']);
const constructServer = R.construct(Server);
const createServer = R.pipe(
  pickRequiredFields,
  constructServer
);

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      return addServer(action.id, createServer({
        id: action.id,
        name: action.name,
        port: action.port,
        type: action.serverType
      }))(state);
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
