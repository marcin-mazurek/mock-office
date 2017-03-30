import fs from 'fs';
import HttpServer from '../http-mock-server';
import WSMockServer from '../ws-mock-server';
import { ServerEventsEmitter } from '../globalEvents';

const SAVED_STATE_FILE = './.mockeeState.json';

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
    this.saveDisabled = false;
  }

  backupState() {
    if (this.saveDisabled) {
      return;
    }
    this.saveDisabled = true;
    const serversState = this.servers.map(server => ({
      name: server.instance.name,
      port: server.instance.port,
      type: server.instance.type,
      isSecure: server.instance.isSecure,
      keyPath: server.instance.keyPath,
      certPath: server.instance.certPath,
      isLive: server.instance.isLive(),
      tasks: server.instance.queue.backupTasks()
    }));
    fs.writeFile(SAVED_STATE_FILE, JSON.stringify(serversState), 'utf8', () => {
      this.saveDisabled = false;
    });
  }

  restoreState() {
    this.saveDisabled = true;
    fs.readFile(SAVED_STATE_FILE, (err, data) => {
      if (err) return;

      try {
        const serverState = JSON.parse(data);
        serverState.forEach((s) => {
          const id = this.add(s.name, s.port, s.type, s.isSecure, s.keyPath, s.certPath, false);
          const server = this.find(id);
          server.queue.restoreTasks(s.tasks);
          if (s.isLive) {
            this.start(id, false);
          }
        });
      } catch (e) {
        this.ee.emit('RESTORE_STATE_ERROR', e);
      } finally {
        this.saveDisabled = false;
      }
    });
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
