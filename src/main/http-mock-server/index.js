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
    this.addDescription = this.addDescription.bind(this);
    this.removeDescription = this.removeDescription.bind(this);
    this.setupResponderMiddleware = this.setupResponderMiddleware.bind(this);
    this.start = this.start.bind(this);
    this.saveSocketRef = this.saveSocketRef.bind(this);
    this.destroyOpenSockets = this.destroyOpenSockets.bind(this);
    this.stop = this.stop.bind(this);
    this.isLive = this.isLive.bind(this);
    this.respond = this.respond.bind(this);
  }

  addDescription(task) {
    return this.scenario.addDescription(task);
  }

  removeDescription(taskId) {
    this.scenario.removeDescription(taskId);
  }

  respond(req, res) {
    const description = this.scenario.findDescription(
      {
        event: 'RECEIVED_REQUEST',
        url: req.url
      }
    );

    if (description) {
      scheduler.schedule(send(req, res), description);
    }
  }

  setupResponderMiddleware() {
    this.responder = express();
    this.responder.get('*', this.respond);
  }

  start(cb) {
    const httpServer = this.isSecure ? https : http;
    this.setupResponderMiddleware();

    if (this.isSecure) {
      const credentials = {
        key: fs.readFileSync(this.keyPath),
        cert: fs.readFileSync(this.certPath)
      };

      this.httpServer = httpServer.createServer(credentials, this.responder);
    } else {
      this.httpServer = httpServer.createServer(this.responder);
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
