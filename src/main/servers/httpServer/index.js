import express from 'express';
import expectationsService from '../../expectations';

export default class HttpServer {
  constructor(config) {
    this.load = this.load.bind(this);
    this.unload = this.unload.bind(this);
    this.add = this.add.bind(this);
    this.sockets = [];
    this.expectations = [];
    this.loaded = [];
    this.app = express();
    this.live = false;
    this.port = config.port || 3000;
    this.name = config.name;

    this.app.get('*', (req, res) => {
      const matchedExp = this.matchExpectation(req);

      if (!this.isLive()) {
        res.status(404).end();
        return;
      }

      if (matchedExp) {
        res.json(matchedExp.response.body);
      } else {
        res.status(404).end();
      }
    });
  }

  matchExpectation(req) {
    const matchedExpId = this.loaded.find(loadedId => (
      expectationsService.get(loadedId).request.url === req.url
    ));

    if (matchedExpId) {
      return expectationsService.get(matchedExpId);
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

  add(expectations) {
    this.expectations = this.expectations.concat(expectations);
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
