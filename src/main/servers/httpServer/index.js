import express from 'express';
import R from 'ramda';
import queues from '../../queues';

const sendDefaultExpectation = res => () => res.status(404).end();
const sendExpectation = R.curry((res, expectation) => res.json(expectation.body));
const triggerExpectation = R.curry((serverId, req, res) => (
  queues.prepareExpectation(serverId, { url: req.url })
    .then(sendExpectation(res))
    .catch(sendDefaultExpectation(res))
));

export default class HttpServer {
  constructor(config) {
    this.sockets = [];
    this.type = 'http';
    this.instance = express();
    this.live = false;
    this.port = config.port || 3000;
    this.name = config.name;
    this.id = config.id;
    this.queueId = config.queueId;
  }

  start(cb) {
    this.httpServer = this.instance.listen(this.port, () => {
      this.httpServer.on('connection', socket => this.sockets.push(socket));
      this.instance.get('*', triggerExpectation(this.id));
      cb();
    });
  }

  stop(cb) {
    this.sockets.forEach(socket => socket.destroy());
    this.sockets.length = 0;
    this.httpServer.close(cb);
  }

  addExpectation(expectation) {
    return queues.addExpectation(this.queueId, expectation);
  }

  isLive() {
    return this.httpServer ? this.httpServer.listening : false;
  }
}
