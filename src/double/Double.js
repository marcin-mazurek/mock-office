import HttpServer from './http-mock-server';
import WSMockServer from './ws-mock-server';
import { DoubleEmitter } from './emitter';

const serverTypes = {
  http: HttpServer,
  ws: WSMockServer
};

class Double {
  constructor() {
    this.servers = [];
    this.add = this.add.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.find = this.find.bind(this);
    this.getAll = this.getAll.bind(this);
    this.remove = this.remove.bind(this);
    this.rename = this.rename.bind(this);
    this.emitter = new DoubleEmitter();
  }

  add(name, port, type, isSecure, keyPath, certPath) {
    const ServerConstructor = serverTypes[type];
    const server = new ServerConstructor(
      { name, port, isSecure, keyPath, certPath, emitter: this.emitter }
    );
    this.servers.push(server);
    return server.id;
  }

  start(id) {
    const server = this.find(id);

    if (!server.isLive()) {
      return new Promise((resolve, reject) => {
        server.start(resolve, reject);
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
    return this.servers.find(server => server.id === id);
  }

  getAll() {
    return [].concat(this.servers);
  }

  remove(id) {
    const index = this.servers.findIndex(server => server.id === id);

    if (index >= 0) {
      return this.stop(id).then(() => {
        this.servers.splice(index, 1);
      });
    }

    return Promise.reject();
  }

  rename(id, name) {
    const server = this.find(id);

    if (server) {
      server.rename(name);
      return Promise.resolve();
    }

    return Promise.reject();
  }
}

export default Double;
