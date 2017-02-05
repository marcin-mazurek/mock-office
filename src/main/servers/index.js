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
  add(name, port, type) {
    const id = unique();
    const queueId = queues.addQueue(id);
    const Server = serverTypes[type];
    servers.push(new Server({ name, port, id, queueId }));
    return { serverId: id, queueId };
  },
  start(id) {
    const serverToStart = servers.find(server => server.id === id);

    if (!serverToStart.isLive()) {
      return new Promise((resolve) => {
        serverToStart.start(resolve);
      });
    }

    // eslint-disable-next-line no-console
    console.log('Mockee server is running!');
    return Promise.resolve();
  },
  stop(id) {
    const serverToStop = servers.find(server => server.id === id);

    if (serverToStop.isLive()) {
      return new Promise((resolve) => {
        serverToStop.stop(resolve);
      });
    }

    // eslint-disable-next-line no-console
    console.log('Mockee server is shut down!');
    return Promise.resolve();
  },
  get(id) {
    return servers.find(server => server.id === id);
  },
  getAll() {
    return servers;
  },
  addExpectation(serverId, expectation) {
    const server = servers.find(srv => srv.id === serverId);

    return server.addExpectation(expectation);
  }
};

export default api;
