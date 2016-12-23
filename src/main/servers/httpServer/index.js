import express from 'express';

export default class HttpServer {
  constructor(config) {
    this.load = this.load.bind(this);
    this.unload = this.unload.bind(this);
    this.add = this.add.bind(this);
    this.sockets = [];
    this.endpoints = {};
    this.loaded = [];
    this.app = express();
    this.live = false;
    this.port = config.port || 3000;
    this.name = config.name;

    this.app.get('*', (req, res) => {
      const payload = this.preparePayload(req);

      if (!this.isLive()) {
        res.status(404).end();
        return;
      }

      if (payload) {
        res.json(payload);
      } else {
        res.status(404).end();
      }
    });
  }

  preparePayload(req) {
    let endpoint;
    this.loaded.forEach((loadedId) => {
      if (this.endpoints[loadedId].request.url === req.url) {
        endpoint = this.endpoints[loadedId];
      }
    });

    if (endpoint) {
      return endpoint.response.body;
    }

    return undefined;
  }

  start(cb) {
    this.server = this.app.listen(this.port, cb);
    this.server.on('connection', socket => this.sockets.push(socket));
  }

  stop(cb) {
    this.sockets.forEach(socket => socket.destroy());
    this.sockets.length = 0;
    this.server.close(cb);
  }

  add(mocks) {
    const mocksAsMap = mocks.reduce(
        (prev, next) => {
          const reducedMocks = prev;
          reducedMocks[next.id] = next;
          return reducedMocks;
        }, {}
      ) || {};

    Object.assign(this.endpoints, mocksAsMap);
  }

  isLive() {
    return this.server ? this.server.listening : false;
  }

  load(id) {
    this.loaded.push(id);
  }

  unload(id) {
    const indexOfMockToLoad = this.loaded.indexOf(endpointId => endpointId === id);
    this.loaded.splice(indexOfMockToLoad, 1);
  }
}
