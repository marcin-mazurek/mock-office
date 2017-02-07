import express from 'express';
import R from 'ramda';
import https from 'https';
import http from 'http';
import fs from 'fs';
import queues from '../../queues';

const sendDefaultExpectation = res => () => res.status(404).end();
const sendExpectation = R.curry((res, expectation) => res.json(expectation.body));
const respond = R.curry((queueId, req, res) => (
  queues.tryRun(
    queueId,
    { url: req.url },
    sendExpectation(res),
    sendDefaultExpectation(res)
  ))
);

export default class HttpServer {
  constructor(config) {
    this.sockets = [];
    this.type = 'http';
    this.port = config.port || 3000;
    this.name = config.name;
    this.id = config.id;
    this.queueId = config.queueId;
    this.isSecure = config.isSecure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
  }

  start(cb) {
    const httpServer = this.isSecure ? https : http;
    this.app = express();
    this.app.on('connection', socket => this.sockets.push(socket));
    this.app.get('*', respond(this.queueId));

    if (this.isSecure) {
      const credentials = {
        key: fs.readFileSync(this.keyPath),
        cert: fs.readFileSync(this.certPath)
      };

      this.httpServer = httpServer.createServer(credentials, this.app);
    } else {
      this.httpServer = httpServer.createServer(this.app);
    }

    this.httpServer.listen(this.port, cb);
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
