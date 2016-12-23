import { createSelector } from 'reselect';

export const getAll = state => state.getIn(['servers', 'itemsById']).toList();
export const getSelected = state => state.getIn(['servers', 'selected']);
export const getRunning = state => state.getIn(['servers', 'running']);
export const isRunning = createSelector(
  getSelected,
  getRunning,
  (id, running) => running.has(id)
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
