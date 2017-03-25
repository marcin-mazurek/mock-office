/*
Http-Mock-Server
- is responsible for reacting on requests
- after retrieved request server use scenario for searching instructions
- use scenario for scheduling
- if wants to dispose findDescription it calls scenario method
*/

import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import Scenario from '../scenario';
import scheduler from '../scheduler';

export const send = (req, res) => (task) => {
  res.set('Access-Control-Allow-Origin', req.headers.origin);

  if (task.headers) {
    res.set(task.headers);
  }

  res.json(task.taskPayload);
};

export default class HttpMockServer {
  constructor(config) {
    this.id = config.id;
    this.scenario = new Scenario({ id: this.id });
    this.sockets = [];
    this.type = 'http';
    this.port = config.port || 3000;
    this.name = config.name;
    this.isSecure = config.isSecure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
    this.saveSocketRef = this.saveSocketRef.bind(this);
  }

  addDescription(task) {
    return this.scenario.addDescription(task);
  }

  removeDescription(taskId) {
    this.scenario.removeDescription(taskId);
  }

  start(cb) {
    const httpServer = this.isSecure ? https : http;
    this.app = express();
    this.app.get('*', (req, res) => {
      const description = this.scenario.findDescription(
        {
          event: 'RECEIVED_REQUEST',
          url: req.url
        }
      );

      if (description) {
        scheduler.schedule(send(req, res), description);
      }
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
    this.scenario.cancelSchedulers();
    this.destroyOpenSockets();
    this.httpServer.close(cb);
  }

  isLive() {
    return this.httpServer ? this.httpServer.listening : false;
  }
}
