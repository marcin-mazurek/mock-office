import { createSelector } from 'reselect';

const getIds = state => state.getIn(['servers', 'ids']);
export const getAll = state =>
  getIds(state).map(id => state.getIn(['servers', 'entities', id]));
export const getRunning = state => state.getIn(['servers', 'running']);
export const isRunning = (state, id) => !!state.getIn(['servers', 'running', id]);

export const getServerDetails = (state, id) => {
  const all = getAll(state);
  const selectedServer = all.find(server => server.id === id);

  if (id) {
    return {
      type: selectedServer.type,
      name: selectedServer.name,
      port: selectedServer.port,
      id: selectedServer.id
    };
  }

  return undefined;
};

export const getServerList = createSelector(
  getAll,
  getRunning,
  (servers, running) => servers.map((server) => {
    const mappedServer = server;
    mappedServer.running = running.has(mappedServer.id);
    return mappedServer;
  })
);
