import { Server as WebSocketServer } from 'ws';
import https from 'https';
import http from 'http';
import fs from 'fs';
import WsServerCodex from './WsServerCodex';

export default class WsWebServer {
  constructor(id, config, eventBus) {
    this.id = id;
    if (eventBus) {
      this.eventBus = eventBus;
    }
    this.port = config.port || 3000;
    this.secure = config.secure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.isLive = this.isLive.bind(this);
    this.changePort = this.changePort.bind(this);
    this.pendingBehaviours = [];
    this.codex = new WsServerCodex(this.id);

    const httpServer = this.secure ? https : http;

    if (this.secure) {
      const options = {
        key: fs.readFileSync(this.keyPath),
        cert: fs.readFileSync(this.certPath)
      };

      this.httpServer = httpServer.createServer(options);
    } else {
      this.httpServer = httpServer.createServer();
    }

    this.wsServer = new WebSocketServer({ server: this.httpServer });
    this.wsServer.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(err.message);
    });

    this.wsServer.on('connection', (ws) => {
      // support only one open socket
      if (this.ws) {
        ws.close();
        return;
      }

      this.ws = ws;

      this.ws.on('message', (message) => {
        const behaviour = this.codex.matchBehaviour({
          type: 'message',
          params: {
            message
          }
        });

        if (behaviour) {
          behaviour.configureReceiver(ws);
          behaviour.trigger();
          this.pendingBehaviours.push(behaviour);
        }
      });

      this.ws.on('close', () => {
        this.clearPendingReactions();
        this.ws = null;
      });

      const behaviour = this.codex.matchBehaviour({
        type: 'connection',
      });

      if (behaviour) {
        behaviour.configureReceiver(ws);
        behaviour.trigger();
        this.pendingBehaviours.push(behaviour);
      }
    });
  }

  clearPendingReactions() {
    if (this.pendingBehaviours.length) {
      this.pendingBehaviours.forEach((pB) => {
        pB.cancel();
      });
      this.pendingBehaviours.length = 0;
    }
  }

  start() {
    if (this.isLive()) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.httpServer.listen(this.port, resolve);
    });
  }

  stop() {
    if (!this.isLive()) {
      return Promise.resolve();
    }

    this.clearPendingReactions();
    if (this.ws) {
      this.ws.terminate();
    }
    return new Promise((resolve) => {
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
