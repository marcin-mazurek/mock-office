import fs from 'fs';
import HttpServer from '../http-mock-server';
import WSMockServer from '../ws-mock-server';
import globalEvents, { ServerEventsEmitter } from '../globalEvents';

const SAVED_STATE_FILE = './mockeeState.json';

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
    this.backupState = this.backupState.bind(this);
    this.restoreState = this.restoreState.bind(this);
  }

  backupState() {
    fs.writeFileSync(SAVED_STATE_FILE, JSON.stringify(this.servers), 'utf8');
  }

  restoreState() {
    fs.readFile(SAVED_STATE_FILE, (err, data) => {
      if (err) return;

      try {
        const serverState = JSON.parse(data);
        serverState.forEach((s) => {
          const id = this.add(s.name, s.port, s.type, s.isSecure, s.keyPath, s.certPath, false);
          const server = this.find(id);
          s.scenario.scenes.forEach((scene) => {
            server.getScenario().addScene(scene);
          });
        });
        globalEvents.emit('RESTORE_STATE');

        this.backupState();
      } catch (e) {
        globalEvents.emit('RESTORE_STATE_ERROR', e);
      }
    });
  }

  add(name, port, type, isSecure, keyPath, certPath) {
    const emitter = new ServerEventsEmitter();
    const ServerConstructor = serverTypes[type];
    const server = new ServerConstructor({ name, port, isSecure, keyPath, certPath, emitter });
    this.servers.push(server);
    this.backupState();
    return server.id;
  }

  start(id) {
    const server = this.find(id);

    if (!server.isLive()) {
      return new Promise((resolve, reject) => {
        server.start(resolve, reject);
      }).then(this.backupState);
    }

    return Promise.resolve();
  }

  stop(id) {
    const server = this.find(id);

    if (server.isLive()) {
      return new Promise((resolve) => {
        server.stop(resolve);
      }).then(this.backupState);
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
        this.backupState();
      });
    }

    return Promise.reject();
  }
}

export default ServersHub;
