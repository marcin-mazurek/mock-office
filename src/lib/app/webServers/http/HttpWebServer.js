import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import bodyParser from 'body-parser';
import HttpServerCodex from './HttpServerCodex';

export const send = (req, res, params) => {
  if (params.headers) {
    res.set(params.headers);
  }

  if (params.status) {
    res.status(params.status);
  }

  res.json(params.payload);
};

export default class HttpWebServer {
  constructor(id, config, eventBus) {
    this.id = id;
    if (eventBus) {
      this.eventBus = eventBus;
    }
    this.sockets = [];
    this.port = config.port || 3000;
    this.secure = config.secure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
    this.saveSocketRef = this.saveSocketRef.bind(this);
    this.start = this.start.bind(this);
    this.saveSocketRef = this.saveSocketRef.bind(this);
    this.destroyOpenSockets = this.destroyOpenSockets.bind(this);
    this.stop = this.stop.bind(this);
    this.isLive = this.isLive.bind(this);
    this.handleIncomingRequests = this.handleIncomingRequests.bind(this);
    this.changePort = this.changePort.bind(this);
    this.pendingBehaviours = [];
    this.codex = new HttpServerCodex(this.id);
    const httpServer = this.secure ? https : http;
    const app = express();
    app.use(bodyParser.json());
    app.use('*', this.handleIncomingRequests);

    if (this.secure) {
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

  handleIncomingRequests(req, res) {
    const event = {
      type: 'request',
      params: {
        path: req.originalUrl,
        method: req.method,
        headers: req.headers
      }
    };

    if (req.method === 'POST') {
      event.params.payload = req.body;
    }

    const behaviour = this.codex.matchBehaviour(event);

    if (!behaviour) {
      res.status(404).send('Sorry, we cannot find behaviour.');
      return;
    }

    behaviour.configureReceiver(req, res);
    behaviour.trigger();
    this.pendingBehaviours.push(behaviour);
  }

  start() {
    return new Promise((resolve, reject) => {
      this.httpServer.listen(this.port, resolve);
      this.httpServer.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          reject(`Port ${err.port} is in use. Choose different port.`);
        }
      });
    });
  }

  saveSocketRef(socket) {
    this.sockets.push(socket);
  }

  destroyOpenSockets() {
    this.sockets.forEach(socket => socket.destroy());
    this.sockets.length = 0;
  }

  clearPendingReactions() {
    if (this.pendingBehaviours.length) {
      this.pendingBehaviours.forEach((pB) => {
        pB.cancel();

        if (this.eventBus) {
          this.eventBus.emit(
            'server-reactions-end',
            {
              behaviourId: pB.behaviourId,
              scenarioId: pB.scenarioId,
              serverId: this.id
            }
          );
        }
      });
      this.pendingBehaviours.length = 0;
    }
  }

  stop() {
    return new Promise((resolve) => {
      this.clearPendingReactions();
      // Browsers can keep connection open, thus callback after
      // HttpBehaviourServer.stop cant be called if there are sockets
      // still open, so we need to ensure that all sockets are
      // destroyed
      // https://nodejs.org/api/net.html#net_server_close_callback
      this.destroyOpenSockets();
      this.httpServer.close(resolve);
    });
  }

  isLive() {
    return this.httpServer.listening;
  }

  changePort(port) {
    return new Promise((resolve) => {
      if (this.isLive()) {
        this.stop(() => {
          this.port = port;
          this.start(() => {
            resolve();
          });
        });
      } else {
        this.port = port;
        resolve();
      }
    });
  }
}
