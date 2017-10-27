import EventEmitter from 'events';
import HttpMockServer from './mockServers/httpMockServer';
import WSMockServer from './mockServers/wsMockServer';

const serverTypes = {
  http: HttpMockServer,
  ws: WSMockServer
};

export default class ServersManager extends EventEmitter {
  constructor() {
    super();
    this.servers = [];
    this.add = this.add.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.getServer = this.getServer.bind(this);
    this.getAll = this.getAll.bind(this);
    this.remove = this.remove.bind(this);
    this.rename = this.rename.bind(this);
  }

  add(type, cfg, params) {
    switch (type) {
      case 'server': {
        const ServerConstructor = serverTypes[cfg.type];
        const server = new ServerConstructor(cfg);
        this.servers.push(server);
        this.emit('add-server', {
          serverId: server.id
        });
        return server.id;
      }
      case 'mock': {
        const server = this.servers.find(s => s.id === params.serverId);
        const mockId = server.addMock(params.scenarioId, cfg);
        this.emit('add-mock', {
          scenarioId: params.scenarioId,
          serverId: params.serverId,
          mockId
        });
        const mock = server.getScenario().mocks.find(m => m.id === mockId);
        mock.on('start', () => this.emit('mock-start', {
          mockId,
          scenarioId: params.scenarioId,
          serverId: params.serverId
        }));
        mock.on('end', () => this.emit('mock-end', {
          mockId,
          scenarioId: params.scenarioId,
          serverId: params.serverId
        }));
        mock.on('cancel', () => this.emit('mock-cancel', {
          mockId,
          scenarioId: params.scenarioId,
          serverId: params.serverId
        }));
        mock.on('expire', () => this.emit('mock-expire', {
          mockId,
          scenarioId: params.scenarioId,
          serverId: params.serverId
        }));
        return mockId;
      }
      default: {
        return null;
      }
    }
  }

  start(id) {
    const server = this.getServer(id);

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
    const server = this.getServer(id);

    if (server.isLive()) {
      return new Promise((resolve) => {
        server.stop(resolve);
      });
    }

    return Promise.resolve();
  }

  getServer(id) {
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
    const server = this.getServer(id);

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
        scenario: server.getScenario().id,
        mocks: server.getScenario().getAll()
      })
    );
  }

  setState(state) {
    state.forEach((s) => {
      const id = this.add(
        s.name, s.port, s.type, s.secure, s.keyPath, s.certPath, false
      );
      const server = this.getServer(id);
      s.mocks.forEach((mock) => {
        server.getScenario().addMock(mock);
      });
    });
  }
}
