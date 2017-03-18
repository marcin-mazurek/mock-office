import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import { EventEmitter } from 'events';
import Queue from '../queue';

export const send = (req, res) => (task) => {
  res.set('Access-Control-Allow-Origin', req.headers.origin);

  if (task.headers) {
    res.set(task.headers);
  }

  res.json(task.taskPayload);
};

export default class HttpServer {
  constructor(config) {
    this.ee = new EventEmitter();
    this.queue = new Queue({ ee: this.ee });
    this.sockets = [];
    this.type = 'http';
    this.port = config.port || 3000;
    this.name = config.name;
    this.id = config.id;
    this.isSecure = config.isSecure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
    this.saveSocketRef = this.saveSocketRef.bind(this);
  }

  addTask(task) {
    return this.queue.addTask(task);
  }

  removeTask(taskId) {
    this.queue.removeTask(taskId);
  }

  start(cb) {
    const httpServer = this.isSecure ? https : http;
    this.app = express();
    this.app.get('*', (req, res) => {
      this.queue.openConnection(send(req, res));

      this.queue.runReadyTask(
        {
          url: req.url,
          headers: req.headers
        },
        () => {
          this.queue.closeConnection();
        }
      );
    });

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
    this.httpServer.on('connection', this.saveSocketRef);
  }

  saveSocketRef(socket) {
    this.sockets.push(socket);
  }

  destroyOpenSockets() {
    this.sockets.forEach(socket => socket.destroy());
    this.sockets.length = 0;
  }

  stop(cb) {
    this.queue.closeConnection();
    this.destroyOpenSockets();
    this.httpServer.close(cb);
  }

  isLive() {
    return this.httpServer ? this.httpServer.listening : false;
  }
}
