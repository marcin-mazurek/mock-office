import { Map, List } from 'immutable';
import { createSelector } from 'reselect';
import Server from './Server';

export const getInitialState = () => new Map({
  entities: new Map(),
  ids: new List()
});

export const reducers = {
  addServer(state, id, params) {
    const server = new Server({
      id,
      name: params.name,
      port: params.port,
      type: params.type,
      secure: params.secure,
      scenario: params.scenario
    });

    return state
      .setIn(['entities', server.id], server)
      .update('ids', ids => ids.push(server.id));
  },
  startServer(state, id) {
    return state.setIn(['entities', id, 'running'], true);
  },
  stopServer(state, id) {
    return state.setIn(['entities', id, 'running'], false);
  },
  removeServer(state, id) {
    let newState = state.update('ids', ids => ids.filter(serverId => serverId !== id));
    newState = newState.deleteIn(['entities', id]);
    return newState;
  },
  updateServer(state, id, params) {
    return state.setIn(
      ['entities', id],
      new Server(Object.assign({ id, }, params))
    );
  },
  addScenario(state, server, id) {
    return state.setIn(['entities', server, 'scenario'], id);
  }
};

export const selectors = {
  serverSelector: (state, id) => state.getIn(['servers', 'entities', id]),
  allServerSelector: createSelector(
    state => state.getIn(['servers', 'ids']),
    state => state.getIn(['servers', 'entities']),
    (ids, entities) => ids.map(id => entities.get(id))
  )
};
