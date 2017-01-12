import express from 'express';
import uniqueId from 'node-unique';
import expectationsService from '../../expectations';

export default class HttpServer {
  constructor(config) {
    this.load = this.load.bind(this);
    this.unload = this.unload.bind(this);
    this.add = this.add.bind(this);
    this.sockets = [];
    this.type = 'http';
    this.expectations = [];
    this.loaded = [];
    this.instance = express();
    this.live = false;
    this.port = config.port || 3000;
    this.name = config.name;
    this.id = config.id;
    this.emitUnload = config.emitUnload;
  }

  getResponse(req) {
    const matchedExpIndex = this.matchExpectation(req);

    if (matchedExpIndex >= 0) {
      const matchedExp = this.loaded[matchedExpIndex];

      if (!matchedExp.infinite) {
        matchedExp.quantity -= 1;
      }

      if (matchedExp.quantity < 1) {
        this.emitUnload(this.id, matchedExp.id);
        this.loaded.splice(matchedExpIndex, 1);
      }

      return matchedExp;
    }

    return undefined;
  }

  matchExpectation(req) {
    return this.loaded.findIndex(expectation => (
      expectation.instance.request.url === req.url
    ));
  }

  start(cb) {
    this.httpServer = this.instance.listen(this.port, cb);
  }

  respond() {
    this.httpServer.on('connection', socket => this.sockets.push(socket));

    this.instance.get('*', (req, res) => {
      const matchedExp = this.getResponse(req);

      if (!this.isLive()) {
        res.status(404).end();
        return;
      }

      if (matchedExp) {
        res.json(matchedExp.instance.response.body);
      } else {
        res.status(404).end();
      }
    });
  }

  stop(cb) {
    this.sockets.forEach(socket => socket.destroy());
    this.sockets.length = 0;
    this.httpServer.close(cb);
  }

  add(expectations) {
    this.expectations = this.expectations.concat(expectations);
  }

  isLive() {
    return this.httpServer ? this.httpServer.listening : false;
  }

  load(id, quantity, infinite) {
    const instance = expectationsService.create(id);
    const instanceId = uniqueId();
    this.loaded.push({ id: instanceId, instance, quantity, infinite });

    return instanceId;
  }

  unload(id) {
    const expectationToUnloadIndex = this.loaded.indexOf(expectation => expectation.id === id);
    this.loaded.splice(expectationToUnloadIndex, 1);
  }
}
