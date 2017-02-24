import R from 'ramda';
import unique from 'node-unique';
import HttpServer from './httpServer';
import WSMockServer from './wsServer';
import queues from '../queues';

const serverTypes = {
  http: HttpServer,
  ws: WSMockServer
};

class Servers {
  constructor() {
    this.servers = [];
    this.add = this.add.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.find = this.find.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  add(name, port, type, isSecure, keyPath, certPath) {
    const id = unique();
    const queueId = queues.addQueue(id);
    const Server = serverTypes[type];
    this.servers.push(new Server({ name, port, id, queueId, isSecure, keyPath, certPath }));

    return { serverId: id, queueId };
  }

  start(id) {
    return R.compose(
      server => new Promise((resolve) => {
        if (!server.isLive()) {
          server.start(resolve);
          return;
        }

        resolve();
      }),
      R.find(R.propEq('id', id))
    )(this.servers);
  }

  stop(id) {
    const serverToStop = this.servers.find(server => server.id === id);

    if (serverToStop.isLive()) {
      return new Promise((resolve) => {
        serverToStop.stop(resolve);
      });
    }

    return Promise.resolve();
  }

  find(id) {
    return R.find(R.propEq('id', id))(this.servers);
  }

  getAll() {
    return [].concat(this.servers);
  }
}

export default new Servers();
