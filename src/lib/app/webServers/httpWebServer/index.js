import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import bodyParser from 'body-parser';

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
  constructor(config, onTaskTrigger, onServerStop) {
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
    this.respond = this.respond.bind(this);
    this.changePort = this.changePort.bind(this);
    this.subscriptions = [];
    this.onTaskTrigger = onTaskTrigger;
    this.onServerStop = onServerStop;
    const httpServer = this.secure ? https : http;
    const app = express();
    app.use(bodyParser.json());
    app.use('*', this.respond);

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

  respond(req, res) {
    // allow CORS by default
    if (req.headers.origin) {
      res.set('Access-Control-Allow-Origin', req.headers.origin);
    }

    const requirements = {
      path: req.originalUrl,
      method: req.method,
      headers: req.headers
    };

    if (req.method === 'POST') {
      requirements.payload = req.body;
    }

    this.onTaskTrigger(requirements, (task$) => {
      if (!task$) {
        res.status(404).send('Sorry, we cannot find mock.');
        return;
      }

      this.subscriptions.push(
        task$
          .take(1)
          .subscribe((params) => {
            send(req, res, params);
          })
      );
    });
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

  clearSubscriptions() {
    if (this.subscriptions.length) {
      this.subscriptions.forEach(s => s.unsubscribe());
      this.subscriptions.length = 0;
    }
  }

  stop() {
    return new Promise((resolve) => {
      this.clearSubscriptions();
      this.onServerStop();
      // Browsers can keep connection open, thus callback after
      // HttpMockServer.stop cant be called if there are sockets
      // still open, thus we need to ensure that all sockets are
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
