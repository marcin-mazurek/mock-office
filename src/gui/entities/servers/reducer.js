import { Map, List, Set } from 'immutable';
import { ADD, START, STOP, REMOVE, RENAME, UPDATE } from './actions';
import Server from './Server';
import { ADD as ADD_SCENARIO } from '../scenarios/actions';
import { SUCCEED as ADD_SERVER_SUCCEED } from '../../servers/addServer/actions';

const initialState = new Map({
  entities: new Map(),
  ids: new List(),
  selected: null,
  running: new Set()
});

const addServer = (state, server) =>
  state
    .setIn(['entities', server.id], server)
    .update('ids', ids => ids.push(server.id));

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const params = action.params;
      const server = new Server({
        id: action.id,
        name: params.name,
        port: params.port,
        type: params.type,
        secure: params.secure,
        scenario: params.scenario
      });
      return addServer(state, server);
    }
    case START: {
      return state.setIn(['entities', action.id, 'running'], true);
    }
    case STOP: {
      return state.setIn(['entities', action.id, 'running'], false);
    }
    case REMOVE: {
      let newState = state.update('ids', ids => ids.filter(id => id !== action.id));
      newState = newState.deleteIn(['entities', action.id]);

      if (state.get('selected') === action.id) {
        newState = newState.set('selected', null);
      }
      return newState;
    }
    case RENAME: {
      return state.setIn(['entities', action.id, 'name'], action.name);
    }
    case UPDATE: {
      return state.setIn(['entities', action.id],
        new Server(Object.assign({ id: action.id, }, action.params))
      );
    }
    case ADD_SCENARIO: {
      return state.setIn(['entities', action.server, 'scenario'], action.id);
    }
    case ADD_SERVER_SUCCEED: {
      const { params: { data } } = action;
      const server = new Server({
        id: data.id,
        name: data.name,
        port: data.port,
        type: data.type,
        secure: data.secure,
        scenario: data.scenario
      });
      return state
        .setIn(['entities', data.id, 'scenario'], data.scenario)
        .setIn(['entities', data.id], server)
        .update('ids', ids => ids.push(data.id));
    }
    default: {
      return state;
    }
  }
};
