import { createSelector } from 'reselect';
import { getAll as getAllServers, getSelected } from '../servers/selectors';

// eslint-disable-next-line import/prefer-default-export
export const getAll = state => state.get('queues');

export const getServerQueues = createSelector(
  getSelected,
  getAllServers,
  getAll,
  (selectedServer, servers, queues) =>
    servers.get(selectedServer).get('queues').map(queueId => queues.get(queueId))
);
