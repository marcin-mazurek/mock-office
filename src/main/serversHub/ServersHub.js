import unique from 'node-unique';
import { EventEmitter } from 'events';
import HttpServer from './HttpServer';
import WSMockServer from './WsServer';

const serverTypes = {
  http: HttpServer,
  ws: WSMockServer
};

class ServersHub {
  constructor() {
    this.ee = new EventEmitter();
    this.servers = [];
    this.add = this.add.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.find = this.find.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  add(name, port, type, isSecure, keyPath, certPath) {
    const serverId = unique();
    const ServerConstructor = serverTypes[type];
    const server = new ServerConstructor({ name, port, isSecure, keyPath, certPath });
    server.ee.on('TASK_REMOVED_AFTER_USE', args =>
      this.ee.emit('TASK_REMOVED_AFTER_USE', { serverId, taskId: args.taskId })
    );
    this.servers.push({
      id: serverId,
      instance: server
    });

    return serverId;
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

    return serverFound.instance;
  }

  getAll() {
    return [].concat(this.servers);
  }
}

export default ServersHub;
