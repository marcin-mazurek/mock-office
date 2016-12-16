import RestServer from './restServer';

const serverTypes = {
  rest: RestServer
};

const servers = {};

export default {
  add(name, type) {
    const Server = serverTypes[type];
    const serverInstance = new Server();
    servers[name] = serverInstance;

    return serverInstance;
  },
  get(name) {
    return servers[name];
  },
  remove(name) {
    servers[name] = undefined;
  }
};
