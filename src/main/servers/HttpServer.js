import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import queues from '../queues';

export const send = (req, res) => (task) => {
  if (task.headers) {
    res.set(task.headers);
  }

  res.json(task.taskPayload);
};

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
    this.saveSocketRef = this.saveSocketRef.bind(this);
  }

  start(cb) {
    const httpServer = this.isSecure ? https : http;
    this.app = express();
    this.app.get('*', (req, res) => {
      queues.openTunnel(this.queueId, send(req, res));

      queues.runReadyTasks(
        this.queueId,
        {
          url: req.url,
          headers: req.headers
        },
        () => {
          queues.closeTunnel(this.queueId);
          res.status(404).send('Response not found');
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
    queues.closeTunnel(this.queueId);
    this.destroyOpenSockets();
    this.httpServer.close(cb);
  }

  isLive() {
    return this.httpServer ? this.httpServer.listening : false;
  }
}
