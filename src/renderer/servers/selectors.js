import { createSelector } from 'reselect';

export const getAll = state => state.getIn(['servers', 'entities']);
const getIds = state => state.getIn(['servers', 'ids']);
export const getAllAsList = createSelector(
  getIds,
  getAll,
  (ids, servers) => ids.map(id => servers.get(id))
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
