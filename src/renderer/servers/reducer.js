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

const addQueue = R.curry(
  (serverId, updater, currentState) => currentState.updateIn(['itemsById', serverId, 'queues'], updater)
);

const select = R.curry((id, currentState) => currentState.set('selected', id));
const updateRunning = R.curry((updater, currentState) => currentState.set('running', updater));
const addToRunning = R.curry((id, runningServers) => runningServers.add(id));

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      return R.invoker(2, 'set')('itemsById', R.pipe(
        R.invoker(1, 'get')('itemsById'),
        R.invoker(2, 'set')(action.id,
          R.pipe(
            R.pick(['name', 'port', 'id', 'serverType']),
            R.over(
              R.lens(R.prop('serverType'), R.assoc('type')),
              R.identity
            ),
            R.construct(Server)
          )(action)
        ),
      )(state), state);
    }
    case SELECT: {
      return select(action.id, state);
    }
    case START: {
      return updateRunning(addToRunning(action.id), state);
    }
    case STOP: {
      return R.invoker(2, 'set')('running',
        R.pipe(
          R.invoker(1, 'get')('running'),
          R.invoker(1, 'delete')(action.id),
        )(state),
        state);
    }
    case ADD_QUEUE: {
      const { serverId, queueId } = action;

      return addQueue(serverId, addId(queueId))(state);
    }
    default: {
      return state;
    }
  }
};
