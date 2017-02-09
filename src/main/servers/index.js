import unique from 'node-unique';
import HttpServer from './httpServer';
import WSMockServer from './wsServer';
import queues from '../queues';

const serverTypes = {
  http: HttpServer,
  ws: WSMockServer
};

const servers = [];

const api = {
  add(name, port, type, isSecure, keyPath, certPath) {
    const id = unique();
    const queueId = queues.addQueue(id);
    const Server = serverTypes[type];
    servers.push(new Server({ name, port, id, queueId, isSecure, keyPath, certPath }));
    return { serverId: id, queueId };
  },
  start(id) {
    const serverToStart = servers.find(server => server.id === id);

    if (!serverToStart.isLive()) {
      return new Promise((resolve) => {
        serverToStart.start(resolve);
      });
    }

    return Promise.resolve();
  },
  stop(id) {
    const serverToStop = servers.find(server => server.id === id);

    if (serverToStop.isLive()) {
      return new Promise((resolve) => {
        serverToStop.stop(resolve);
      });
    }

    return Promise.resolve();
  },
  get(id) {
    return servers.find(server => server.id === id);
  },
  getAll() {
    return servers;
  },
  addExpectation(serverId, expectation, shouldRunImmediately) {
    const server = servers.find(srv => srv.id === serverId);

    return server.addExpectation(expectation, shouldRunImmediately);
  }
};

export default api;
