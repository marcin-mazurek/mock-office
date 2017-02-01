import { Record, Map, Set, List } from 'immutable';
import R from 'ramda';
import {
  ADD,
  SELECT,
  START,
  STOP,
  ADD_QUEUE
} from './actions';

const Server = new Record({
  id: '',
  name: 'New Server',
  port: null,
  expectations: new Set(),
  type: '',
  queues: new List()
});

const initialState = new Map({
  itemsById: new Map(),
  selected: null,
  running: new Set()
});

const addId = R.curry(
  (queueId, queues) => queues.push(queueId)
);

const updateServerQueues = R.curry(
  (serverId, updater, currentState) => currentState.updateIn(['itemsById', serverId, 'queues'], updater)
);

const select = R.curry((id, currentState) => currentState.set('selected', id));
const updateRunning = R.curry((updater, currentState) => currentState.set('running', updater));
const addToRunning = R.curry((id, runningServers) => runningServers.add(id));
const removeFromRunning = R.curry((id, runningServers) => runningServers.delete(id));
const addServer = R.curry((id, server, currentState) => currentState.setIn(['itemsById', id], server));
const createServer = R.pipe(
  R.pick(['name', 'port', 'id', 'serverType']),
  R.over(
    R.lens(R.prop('serverType'), R.assoc('type')),
    R.identity
  ),
  R.construct(Server)
);

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      return addServer(action.id, createServer(action), state);
    }
    case SELECT: {
      return select(action.id, state);
    }
    case START: {
      return updateRunning(addToRunning(action.id), state);
    }
    case STOP: {
      return updateRunning(removeFromRunning(action.id), state);
    }
    case ADD_QUEUE: {
      const { serverId, queueId } = action;

      return updateServerQueues(serverId, addId(queueId), state);
    }
    default: {
      return state;
    }
  }
};
