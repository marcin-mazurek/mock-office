import { Server as WebSocketServer } from 'ws';
import R from 'ramda';
import https from 'https';
import http from 'http';
import fs from 'fs';
import queues from '../../queues';

const respond = R.curry((queueId, ws, message) =>
  queues.tryRun(queueId, { message }, exp => ws.send(exp.message), R.identity));

export default class WSMockServer {
  constructor(config) {
    this.type = 'ws';
    this.port = config.port || 3010;
    this.name = config.name;
    this.id = config.id;
    this.listening = false;
    this.queueId = config.queueId;
    this.secure = config.secure;
    this.key = config.key;
    this.cert = config.cert;
  }

  start(cb) {
    const httpServer = this.secure ? https : http;
    const options = {
      key: fs.readFileSync(this.key),
      cert: fs.readFileSync(this.cert)
    };
    const server = this.secure ? httpServer.createServer(options) : httpServer.createServer();
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
