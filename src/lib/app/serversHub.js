import unique from 'cuid';
import HttpWebServer from './webServers/httpWebServer';
import WsWebServer from './webServers/wsWebServer';
import eventBus from './eventBus';

const serverTypes = {
  http: HttpWebServer,
  ws: WsWebServer
};

class ServersHub {
  constructor() {
    this.servers = [];
    this.add = this.add.bind(this);
    this.getServer = this.getServer.bind(this);
    this.getAll = this.getAll.bind(this);
    this.remove = this.remove.bind(this);
    this.rename = this.rename.bind(this);
  }

  add(cfg) {
    const WebServerConstructor = serverTypes[cfg.type];
    const webServer = new WebServerConstructor(cfg, eventBus);
    const server = {
      id: unique(),
      name: cfg.name,
      type: cfg.type,
      webServer
    };
    this.servers.push(server);
    return server;
  }

  getServer(id) {
    return this.servers.find(server => server.id === id);
  }

  getAll() {
    return [].concat(this.servers);
  }

  remove(id) {
    return new Promise((resolve, reject) => {
      const index = this.servers.findIndex(server => server.id === id);

      if (index < 0) {
        reject(false);
      }

      resolve(index);
    })
      .then((index) => {
        const server = this.servers[index];

        return server.webServer
          .stop()
          .then(() => {
            this.servers.splice(index, 1);
            return true;
          });
      });
  }

  rename(id, name) {
    const server = this.getServer(id);

    if (server) {
      server.rename(name);
      return Promise.resolve();
    }

    return Promise.reject();
  }

  getServers() {
    return this.servers;
  }

  setState(state) {
    state.forEach((s) => {
      const id = this.add(
        s.name, s.port, s.type, s.secure, s.keyPath, s.certPath, false
      );
      const server = this.getServer(id);
      s.behaviours.forEach((behaviour) => {
        server.getScenario().addBehaviour(behaviour);
      });
    });
  }
}

export default new ServersHub();
