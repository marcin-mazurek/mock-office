import { Observable } from 'rxjs';
import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import bodyParser from 'body-parser';
import httpProxy from 'http-proxy';
import HttpServerCodex from './HttpServerCodex';

export default class HttpWebServer {
  constructor(id, config) {
    this.saveSocketRef = this.saveSocketRef.bind(this);
    this.start = this.start.bind(this);
    this.saveSocketRef = this.saveSocketRef.bind(this);
    this.destroyOpenSockets = this.destroyOpenSockets.bind(this);
    this.stop = this.stop.bind(this);
    this.isLive = this.isLive.bind(this);
    this.changePort = this.changePort.bind(this);
    this.id = id;
    this.sockets = [];
    this.port = config.port || 3000;
    this.secure = config.secure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
    this.pendingBehaviours = [];
    this.codex = new HttpServerCodex(this.id);
    this.fallbackUrl = config.fallbackUrl || '';
    this.recordMode = false;
    const httpServer = this.secure ? https : http;
    this.proxy = httpProxy.createProxyServer();

    const app = express();
    app.use(bodyParser.json());

    let event;
    let reaction;

    // record
    this.proxy.on('proxyReq', (proxyReq, clientReq) => {
      if (this.recordMode) {
        event = {
          type: 'request',
          params: {
            path: {
              type: 'string',
              enum: [clientReq.url]
            },
            method: {
              type: 'string',
              enum: [clientReq.method]
            }
          }
        };
      }
    });

    this.proxy.on('proxyRes', (proxyRes) => {
      if (this.recordMode) {
        reaction = {
          type: 'response',
          params: {
            status: proxyRes.statusCode
          }
        };

        let body = '';

        proxyRes.on('data', (chunk) => {
          body += chunk;
        });
        proxyRes.on('end', () => {
          reaction.params.payload = body;
          this.codex.addBehaviour({
            event,
            reactions: [reaction],
            loadedCounter: 1000
          });
        });
      }
    });

    const middlewares = [
      (req, res, next) => {
        this.handler({ req, res, next });
      },
      (req, res, next) => {
        if (this.fallbackUrl) {
          // add url property to request to path be visible to servers other than node http
          // eslint-disable-next-line no-param-reassign
          req.url = req.originalUrl;
          this.proxy.web(req, res, { target: this.fallbackUrl });
        } else {
          next();
        }
      }
    ];

    app.use('*', middlewares);

    this.request$ = Observable
      .fromEventPattern((handler) => {
        this.handler = handler;
      })
      .do(({ req, res, next }) => {
        const behaviour = this.codex.matchBehaviour(HttpWebServer.requestToEvent(req));

        if (behaviour) {
          behaviour
            .configureReceiver(req, res)
            .execute();
          this.pendingBehaviours.push(behaviour);
        } else {
          next();
        }
      });

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

  // requestToEvent :: http.ClientRequest -> Object
  static requestToEvent(req) {
    return {
      type: 'request',
      params: {
        path: req.originalUrl,
        method: req.method,
        headers: req.headers
      }
    };
  }

  // start :: void -> Promise
  start() {
    return new Promise((resolve, reject) => {
      this.requestsSub = this.request$.subscribe();
      this.httpServer.listen(this.port, resolve);
      this.httpServer.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          reject(`Port ${err.port} is in use. Choose different port.`);
        }
      });
    });
  }

  // triggerRecordMode :: Boolean -> void
  triggerRecordMode(shouldRecord) {
    this.recordMode = shouldRecord;
  }

  // saveSocketRef :: Socket -> void
  saveSocketRef(socket) {
    this.sockets.push(socket);
  }

  // destroyOpenSockets :: void -> void
  destroyOpenSockets() {
    this.sockets.forEach(socket => socket.destroy());
    this.sockets.length = 0;
  }

  // clearPendingReactions :: void -> void
  clearPendingReactions() {
    this.pendingBehaviours.forEach(pB => pB.cancel());
    this.pendingBehaviours.length = 0;
  }

  // stop :: void -> Promise
  stop() {
    return new Promise((resolve) => {
      if (this.requestsSub) {
        this.requestsSub.unsubscribe();
        this.requestsSub = null;
      }

      // Browsers can keep connection open, thus callback after
      // HttpBehaviourServer.stop cant be called if there are sockets
      // still open, so we need to ensure that all sockets are
      // destroyed
      // https://nodejs.org/api/net.html#net_server_close_callback
      this.destroyOpenSockets();
      this.httpServer.close(resolve);
    });
  }

  // void -> Boolean
  isLive() {
    return this.httpServer.listening;
  }

  // changePort :: String -> Promise
  changePort(port) {
    if (this.isLive()) {
      return this.stop()
        .then(() => {
          this.port = port;
        })
        .then(() => {
          this.start();
        });
    }

    this.port = port;
    return Promise.resolve();
  }
}
