/*
 Http-Mock-Server
 - is responsible for reacting on requests
 - after retrieved request server use scenario for searching instructions
 - use scenario for scheduling
 - if wants to dispose findScene it calls scenario method
 */

import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import Scenario from '../scenario';

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
    this.addScene = this.addScene.bind(this);
    this.removeScene = this.removeScene.bind(this);
    this.start = this.start.bind(this);
    this.saveSocketRef = this.saveSocketRef.bind(this);
    this.destroyOpenSockets = this.destroyOpenSockets.bind(this);
    this.stop = this.stop.bind(this);
    this.isLive = this.isLive.bind(this);
    this.respond = this.respond.bind(this);

    const httpServer = this.isSecure ? https : http;
    const app = express();
    app.get('*', this.respond);

    if (this.isSecure) {
      const credentials = {
        key: fs.readFileSync(this.keyPath),
        cert: fs.readFileSync(this.certPath)
      };

      this.httpServer = httpServer.createServer(credentials, app);
    } else {
      this.httpServer = httpServer.createServer(app);
    }

    this.httpServer.on('connection', this.saveSocketRef);
  }

  addScene(task) {
    return this.scenario.addScene(task);
  }

  removeScene(taskId) {
    this.scenario.removeScene(taskId);
  }

  respond(req, res) {
    const scene = this.scenario.findScene(
      {
        event: 'RECEIVED_REQUEST',
        url: req.url
      }
    );

    if (scene) {
      this.scenario.play(scene.id, () => {
        send(req, res)(scene);
      });
    }
  }

  start(cb) {
    this.httpServer.listen(this.port, cb);
  }

  saveSocketRef(socket) {
    this.sockets.push(socket);
  }

  destroyOpenSockets() {
    this.sockets.forEach(socket => socket.destroy());
    this.sockets.length = 0;
  }

  stop(cb) {
    this.scenario.cancelPendingScenes();
    this.destroyOpenSockets();
    this.httpServer.close(cb);
  }

  isLive() {
    return this.httpServer.listening;
  }
}
