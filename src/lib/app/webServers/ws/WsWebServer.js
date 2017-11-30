import { Server as WebSocketServer } from 'ws';
import { Observable } from 'rxjs';
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

    this.connections$ = Observable.fromEventPattern((handler) => {
      this.wsServer.on('connection', handler);
    })
    // support only one client
    .filter(() => !this.ws)
    .do((ws) => {
      this.ws = ws;
      this.messages$ = Observable.fromEventPattern((handler) => {
        ws.on('message', handler);
      })
        .map(message => ({
          type: 'message',
          params: {
            message
          }
        }))
        .map(event => this.codex.matchBehaviour(event))
        .filter(behaviour => !!behaviour)
        .do((behaviour) => {
          behaviour
            .configureReceiver(this.ws)
            .execute();
        });
      this.messagesSub = this.messages$.subscribe();

      this.clientDisconnect$ = Observable.fromEventPattern((handler) => {
        this.ws.on('close', handler);
      })
        .take(1)
        .do(() => {
          this.clearPendingReactions();
          this.ws = null;
          this.connectionSub = this.connections$.subscribe();
        });

      this.clientDisconnectSub = this.clientDisconnect$.subscribe();
    })
    .mapTo({
      type: 'connection',
    })
    .map(event => ({
      behaviour: this.codex.matchBehaviour(event)
    }))
    .filter(({ behaviour }) => !!behaviour)
    .do(({ behaviour }) => {
      behaviour
      .configureReceiver(this.ws)
      .execute();
      this.pendingBehaviours.push(behaviour);
    });
  }

  clearPendingReactions() {
    this.pendingBehaviours.forEach(pB => pB.cancel());
    this.pendingBehaviours.length = 0;
  }

  start() {
    if (this.isLive()) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.connectionSub = this.connections$.subscribe();
      this.httpServer.listen(this.port, resolve);
    });
  }

  stop() {
    if (!this.isLive()) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      if (this.ws) {
        this.ws.terminate();
      }

      this.httpServer.close(resolve);
    });
  }

  isLive() {
    return this.httpServer.listening;
  }

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
