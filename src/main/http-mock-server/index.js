import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import unique from 'node-unique';
import Scenario from '../scenario';

export const send = (req, res) => (args) => {
  if (req.headers.origin) {
    res.set('Access-Control-Allow-Origin', req.headers.origin);
  }

  if (args.headers) {
    res.set(args.headers);
  }

  res.json(args.payload);
};

export default class HttpMockServer {
  constructor(config) {
    this.id = unique();
    this.emitter = config.emitter.extend({ serverId: this.id });
    this.scenario = new Scenario({ emitter: this.emitter });
    this.sockets = [];
    this.type = 'http';
    this.port = config.port || 3000;
    this.name = config.name;
    this.isSecure = config.isSecure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
    this.saveSocketRef = this.saveSocketRef.bind(this);
    this.start = this.start.bind(this);
    this.saveSocketRef = this.saveSocketRef.bind(this);
    this.destroyOpenSockets = this.destroyOpenSockets.bind(this);
    this.stop = this.stop.bind(this);
    this.isLive = this.isLive.bind(this);
    this.respond = this.respond.bind(this);
    this.getScenario = this.getScenario.bind(this);

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

  getScenario() {
    return this.scenario;
  }

  respond(req, res) {
    const scene = this.scenario.findScene(
      {
        event: 'RECEIVED_REQUEST',
        url: req.url
      }
    );

    if (scene) {
      this.scenario.play(scene.id, send(req, res));
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
