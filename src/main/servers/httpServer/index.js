import express from 'express';
import uniqueId from 'node-unique';
import expectationsService from '../../expectations';
import { EXPECTATION_UNLOAD_AFTER_USE } from '../../../common/messageNames';

export default class HttpServer {
  constructor(config) {
    this.load = this.load.bind(this);
    this.unload = this.unload.bind(this);
    this.add = this.add.bind(this);
    this.ee = config.ee;
    this.sockets = [];
    this.expectations = [];
    this.loaded = [];
    this.app = express();
    this.live = false;
    this.port = config.port || 3000;
    this.name = config.name;
    this.id = config.id;

    this.app.get('*', (req, res) => {
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

  getResponse(req) {
    const matchedExpIndex = this.matchExpectation(req);

    if (matchedExpIndex >= 0) {
      const matchedExp = this.loaded[matchedExpIndex];

      matchedExp.quantity -= 1;

      if (matchedExp.quantity < 1) {
        this.ee.emit(EXPECTATION_UNLOAD_AFTER_USE, {
          serverId: this.id,
          expectationId: matchedExp.id
        });

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

  load(id, quantity) {
    const instance = expectationsService.create(id);
    const instanceId = uniqueId();
    this.loaded.push({ id: instanceId, instance, quantity });

    return instanceId;
  }

  unload(id) {
    const expectationToUnloadIndex = this.loaded.indexOf(expectation => expectation.id === id);
    this.loaded.splice(expectationToUnloadIndex, 1);
  }
}
