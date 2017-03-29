import HttpServer from '../http-mock-server';
import WSMockServer from '../ws-mock-server';
import { ServerEventsEmitter } from '../globalEvents';

const serverTypes = {
  http: HttpServer,
  ws: WSMockServer
};

class ServersHub {
  constructor() {
    this.servers = [];
    this.add = this.add.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.find = this.find.bind(this);
    this.getAll = this.getAll.bind(this);
    this.remove = this.remove.bind(this);
  }

  add(name, port, type, isSecure, keyPath, certPath) {
    const emitter = new ServerEventsEmitter();
    const ServerConstructor = serverTypes[type];
    const server = new ServerConstructor({ name, port, isSecure, keyPath, certPath, emitter });
    this.servers.push(server);
    return server.id;
  }

  start(id) {
    const server = this.find(id);

    if (!server.isLive()) {
      return new Promise((resolve) => {
        server.start(resolve);
      });
    }

    return Promise.resolve();
  }

  stop(id) {
    const server = this.find(id);

    if (server.isLive()) {
      return new Promise((resolve) => {
        server.stop(resolve);
      });
    }

    return Promise.resolve();
  }

  find(id) {
    const serverFound = this.servers.find(server => server.id === id);

    if (!serverFound) {
      return undefined;
    }

    return serverFound;
  }

  getAll() {
    return [].concat(this.servers);
  }

  remove(id) {
    const index = this.servers.findIndex(server => server.id === id);

    if (index >= 0) {
      const promise = this.stop(id);

      this.servers.splice(index, 1);
      return promise;
    }

    return Promise.reject();
  }
}

export default ServersHub;
