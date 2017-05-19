import { createSelector } from 'reselect';

export const serverSelector = (state, id) => state.getIn(['servers', 'entities', id]);
export const allServerSelector = createSelector(
  state => state.getIn(['servers', 'ids']),
  state => state.getIn(['servers', 'entities']),
  (ids, entities) => ids.map(id => entities.get(id))
);

//
// export const getAll = ;
// export const getRunning = state => state.getIn(['servers', 'running']);
// export const isRunning = (state, id) => !!state.getIn(['servers', 'running', id]);
//
// export const getServerList = createSelector(
//   getAll,
//   getRunning,
//   (servers, running) => servers.map((server) => {
//     const mappedServer = server;
//     mappedServer.running = running.has(mappedServer.id);
//     return mappedServer;
//   })
// );
