import unique from 'node-unique';
import HttpServer from './httpServer';

const serverTypes = {
  http: HttpServer
};

const servers = {};

export default {
  add(type, config) {
    const Server = serverTypes[type];
    const serverInstance = new Server(config);
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
