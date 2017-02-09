import { Server as WebSocketServer } from 'ws';
import R from 'ramda';
import https from 'https';
import http from 'http';
import fs from 'fs';
import queues from '../../queues';

const respond = R.curry((queueId, ws, message) =>
  queues.runTaskWithRequirements(queueId, { message }, exp => ws.send(exp.message), R.identity)
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
    this.tasksToRun = [];
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

    this.httpServer = server.listen(this.port);
    this.wsServer = new WebSocketServer({ server: this.httpServer });
    this.listening = true;
    this.wsServer.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(err.message);
    });

    this.wsServer.on('connection', (ws) => {
      // support only one open socket
      if (this.ws) {
        ws.close();
        return;
      }

      this.ws = ws;
      this.setupSocket(ws);
      this.tasksToRun.forEach(task =>
        queues.runTask(this.queueId, task, exp => this.ws.send(exp.message))
      );
    });
    cb();
  }

  setupSocket(socket) {
    socket.on('message', respond(this.queueId, this.ws));

    socket.on('close', () => {
      queues.stopPendingTasks(this.queueId);
      this.ws = undefined;
    });
  }

  stop(cb) {
    this.tasksToRun = queues.stopPendingTasks(this.queueId);

    this.wsServer.close(() => {
      this.listening = false;
      this.httpServer.close(cb);
    });
  }

  addExpectation(expectation, shouldRunImmediately) {
    const expectationId = queues.addExpectation(this.queueId, expectation);
    const connected = !!this.ws;

    if (shouldRunImmediately) {
      if (connected) {
        queues.runTask(this.queueId, expectationId, exp => this.ws.send(exp.message));
      } else {
        this.tasksToRun.push(expectationId);
      }
    }

    return expectationId;
  }

  isLive() {
    return this.listening;
  }
}
