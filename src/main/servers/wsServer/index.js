import { Server as WebSocketServer } from 'ws';
import R from 'ramda';
import https from 'https';
import http from 'http';
import fs from 'fs';
import queues from '../../queues';

const respond = R.curry((queueId, ws, message) =>
  queues.tryRun(queueId, { message }, exp => ws.send(exp.message), R.identity)
);

export default class WSMockServer {
  constructor(config) {
    this.type = 'ws';
    this.port = config.port || 3010;
    this.name = config.name;
    this.id = config.id;
    this.listening = false;
    this.queueId = config.queueId;
    this.isSecure = config.isSecure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
  }

  start(cb) {
    const httpServer = this.secure ? https : http;
    let server;

    if (this.isSecure) {
      const options = {
        key: fs.readFileSync(this.keyPath),
        cert: fs.readFileSync(this.certPath)
      };

      server = httpServer.createServer(options);
    } else {
      server = httpServer.createServer();
    }

    const app = server.listen(this.port);
    this.instance = new WebSocketServer({ server: app });
    this.listening = true;
    this.instance.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(err.message);
    });

    this.instance.on('connection', (ws) => {
      this.ws = ws;
      this.ws.on('message', respond(this.queueId, this.ws));
    });
    cb();
  }

  stop(cb) {
    this.instance.close(() => {
      this.listening = false;
      cb();
    });
  }

  addExpectation(expectation, shouldRunImmediately) {
    const expectationId = queues.addExpectation(this.queueId, expectation);

    if (shouldRunImmediately && this.isLive()) {
      queues.run(this.queueId, expectationId, exp => this.ws.send(exp.message));
    }

    return expectationId;
  }

  isLive() {
    return this.listening;
  }
}
