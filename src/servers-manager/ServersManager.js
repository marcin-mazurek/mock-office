import HttpMockServer from '../httpMockServer';
import WSMockServer from '../wsMockServer';
import { DoublesEmitter } from './emitter';

const serverTypes = {
  http: HttpMockServer,
  ws: WSMockServer
};

class ServersManager {
  constructor() {
    this.servers = [];
    this.add = this.add.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.find = this.find.bind(this);
    this.getAll = this.getAll.bind(this);
    this.remove = this.remove.bind(this);
    this.rename = this.rename.bind(this);
    this.emitter = new DoublesEmitter();
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

    if (!server) {
      return Promise.resolve(false);
    }

    if (!server.isLive()) {
      return new Promise((resolve, reject) => {
        server.start(() => resolve(true), reject);
      });
    }

    return Promise.resolve(true);
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

  getState() {
    return this.servers.map(
      server => ({
        running: server.isLive(),
        name: server.name,
        type: server.type,
        port: server.port,
        id: server.id,
        scenes: server.getScenario().scenes.map(scene => ({
          id: scene.id,
          title: scene.title,
          interval: scene.interval,
          reuse: scene.reuse,
          quantity: scene.quantity,
          delay: scene.delay,
          requirements: scene.requirements,
          parts: scene.parts.map(part => ({
            id: part.id,
            pending: part.pending,
            title: part.scheduleDetails.title,
            type: part.scheduleDetails.type,
            delay: part.scheduleDetails.delay
          }))
        }))
      })
    );
  }

  setState(state) {
    state.forEach((s) => {
      const id = this.add(
        s.name, s.port, s.type, s.isSecure, s.keyPath, s.certPath, false
      );
      const server = this.find(id);
      s.scenes.forEach((scene) => {
        server.getScenario().addScene(scene);
      });
    });
  }
}

export default ServersManager;
