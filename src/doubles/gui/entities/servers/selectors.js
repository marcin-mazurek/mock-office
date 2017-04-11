import { createSelector } from 'reselect';

const getIds = state => state.getIn(['servers', 'ids']);
export const getAll = state =>
  getIds(state).map(id => state.getIn(['servers', 'entities', id]));
export const getSelected = state => state.getIn(['servers', 'selected']);
export const getRunning = state => state.getIn(['servers', 'running']);
export const isRunning = createSelector(
  getSelected,
  getRunning,
  (id, running) => running.includes(id)
);

export const getSelectedServerDetails = createSelector(
  getSelected,
  getAll,
  (serverId, all) => {
    const selectedServer = all.find(server => server.id === serverId);

    if (serverId) {
      return {
        type: selectedServer.type,
        name: selectedServer.name,
        port: selectedServer.port,
        id: selectedServer.id
      };
    }

    return undefined;
  }
);

export const getServerList = createSelector(
  getAll,
  getRunning,
  (servers, running) => servers.map((server) => {
    const mappedServer = server;
    mappedServer.running = running.has(mappedServer.id);
    return mappedServer;
  })
);
