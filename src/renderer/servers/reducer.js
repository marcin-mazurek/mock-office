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
  type: '',
  queue: ''
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
const changeObjPropName = (old, current) => R.over(
  R.lens(R.prop(old), R.assoc(current)),
  R.identity
);
const pickRequiredFields = R.pick(['name', 'port', 'id', 'serverType', 'queue']);
const constructServer = R.construct(Server);
const createServer = R.pipe(
  pickRequiredFields,
  changeObjPropName('serverType', 'type'),
  constructServer
);

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      return addServer(action.id, createServer(action))(state);
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
