import { createSelector } from 'reselect';

export const getAll = state => state.getIn(['servers', 'entities']);
export const getAllAsList = createSelector(
  getAll,
  servers => servers.toList()
);
export const getSelected = state => state.getIn(['servers', 'selected']);
export const getRunning = state => state.getIn(['servers', 'running']);
export const isRunning = createSelector(
  getSelected,
  getRunning,
  (id, running) => running.has(id)
);
export const getServerList = createSelector(
  getAllAsList,
  getRunning,
  (servers, running) => servers.map((server) => {
    const mappedServer = server;
    mappedServer.running = running.has(mappedServer.id);

    return mappedServer;
  })
);

export const getSelectedServerDetails = createSelector(
  getSelected,
  getAll,
  (serverId, all) => {
    if (serverId) {
      return {
        type: all.get(serverId).type,
        name: all.get(serverId).name,
        port: all.get(serverId).port,
        id: all.get(serverId).id
      };
    }

    return undefined;
  }
);
