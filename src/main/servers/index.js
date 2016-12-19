import unique from 'node-unique';
import RestServer from './restServer';

const serverTypes = {
  rest: RestServer
};

const servers = {};

export default {
  add(name, type) {
    const Server = serverTypes[type];
    const serverInstance = new Server();
    const id = unique();
    servers[id] = serverInstance;

    return id;
  },
  get(id) {
    return servers[id];
  },
  remove(name) {
    servers[name] = undefined;
  }
};
