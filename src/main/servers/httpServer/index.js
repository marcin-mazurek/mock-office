import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import queues from '../../queues';

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
    this.app.get('*', (req, res) => {
      queues.openTunnel(
        this.queueId,
        task => res.json(task.body)
      );

      queues.runReadyTasks(
        this.queueId,
        { url: req.url },
        () => { queues.closeTunnel(this.queueId); }
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

  addTask(task) {
    return queues.addTask(this.queueId, task);
  }

  isLive() {
    return this.httpServer ? this.httpServer.listening : false;
  }
}
