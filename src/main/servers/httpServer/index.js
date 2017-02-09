import express from 'express';
import R from 'ramda';
import https from 'https';
import http from 'http';
import fs from 'fs';
import queues from '../../queues';

const sendDefaultTask = res => () =>
  res.status(404).send('Mockee: cannot find response for this request');
const sendTask = R.curry((res, task) => res.json(task.body));
const respond = R.curry((queueId, req, res) => (
  queues.runTaskWithRequirements(
    queueId,
    { url: req.url },
    sendTask(res),
    sendDefaultTask(res)
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
    this.httpServer.on('connection', socket => this.sockets.push(socket));
  }

  stop(cb) {
    this.tasksToRun = queues.stopPendingTasks(this.queueId);
    this.sockets.forEach(socket => socket.destroy());
    this.sockets.length = 0;
    this.httpServer.close(cb);
  }

  addTask(task) {
    return queues.addTask(this.queueId, task);
  }

  isLive() {
    return this.httpServer ? this.httpServer.listening : false;
  }
}
