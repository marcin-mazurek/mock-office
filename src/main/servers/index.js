import unique from 'node-unique';
import HttpServer from './httpServer';

const serverTypes = {
  http: HttpServer
};

const servers = {};

export default {
  add(type, config) {
    const id = unique();
    const Server = serverTypes[type];
    servers[id] = new Server(Object.assign(config, { id }));

    return id;
  },
  get(id) {
    return servers[id];
  },
  remove(name) {
    servers[name] = undefined;
  }
};
