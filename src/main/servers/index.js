import unique from 'node-unique';
import HttpServer from './httpServer';
import WSMockServer from './wsServer';

const serverTypes = {
  http: HttpServer,
  ws: WSMockServer
};

const servers = {};

const api = {
  add(name, port, type) {
    const id = unique();
    const Server = serverTypes[type];
    servers[id] = new Server({ name, port, id });
    return { name, port, type, id };
  },
  start(id) {
    const serverToStart = servers[id];

    if (!serverToStart.isLive()) {
      return new Promise((resolve) => {
        serverToStart.start(() => {
          serverToStart.respond();
          // eslint-disable-next-line no-console
          console.log('Mockee server is running!');
          resolve();
        });
      });
    }

    // eslint-disable-next-line no-console
    console.log('Mockee server is running!');
    return Promise.resolve();
  },
  stop(id) {
    const serverToStop = servers[id];

    if (serverToStop.isLive()) {
      return new Promise((resolve) => {
        serverToStop.stop(() => {
          // eslint-disable-next-line no-console
          console.log('Mockee server is shut down!');
          resolve();
        });
      });
    }

    // eslint-disable-next-line no-console
    console.log('Mockee server is shut down!');
    return Promise.resolve();
  },
  get(id) {
    return servers[id];
  },
  getAll() {
    return servers;
  }
};

export default api;
