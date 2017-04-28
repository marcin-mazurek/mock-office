import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import unique from 'cuid';
import Scenario from '../scenario';

export const send = (req, res) => (params) => {
  if (req.headers.origin) {
    res.set('Access-Control-Allow-Origin', req.headers.origin);
  }

  if (params.headers) {
    res.set(params.headers);
  }

  res.json(params.payload);
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
    this.changeName = this.changeName.bind(this);
    this.changePort = this.changePort.bind(this);

    const httpServer = this.isSecure ? https : http;
    const app = express();
    app.use('*', this.respond);

    if (this.isSecure) {
      const credentials = {
        key: fs.readFileSync(this.keyPath),
        cert: fs.readFileSync(this.certPath)
      };

      this.httpServer = httpServer.createServer(credentials, app);
    } else {
      this.httpServer = httpServer.createServer(app);
    }

    // we need store sockets to destroy them manually before closing server
    this.httpServer.on('connection', this.saveSocketRef);
  }

  getScenario() {
    return this.scenario;
  }

  respond(req, res) {
    const scene = this.scenario.findScene(
      {
        event: 'RECEIVED_REQUEST',
        request: {
          url: req.url,
          method: req.method,
          headers: req.headers
        }
      }
    );

    if (scene) {
      this.scenario.play(scene.id, send(req, res));
    } else {
      res.set('Access-Control-Allow-Origin', req.headers.origin)
        .status(404).send('Sorry, we cannot find scene.');
    }
  }

  start(onSuccess, onError) {
    this.httpServer.listen(this.port, onSuccess);
    this.httpServer.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        onError(`Port ${err.port} is in use. Choose different port.`);
      }
    });
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
    // Browsers can keep connection open, thus callback after
    // HttpMockServer.stop cant be called if there are sockets
    // still open, thus we need to ensure that all sockets are
    // destroyed
    // https://nodejs.org/api/net.html#net_server_close_callback
    this.destroyOpenSockets();
    this.httpServer.close(cb);
  }

  rename(name) {
    this.name = name;
  }

  isLive() {
    return this.httpServer.listening;
  }

  changeName(name) {
    this.name = name;
  }

  changePort(port) {
    this.port = port;
  }
}
