import { Server as WebSocketServer } from 'ws';
import https from 'https';
import http from 'http';
import fs from 'fs';
import unique from 'cuid';
import Codex from '../codex';

export default class WsWebServer {
  constructor(config, eventBus) {
    if (eventBus) {
      this.eventBus = eventBus;
    }
    this.port = config.port || 3000;
    this.id = unique();
    this.secure = config.secure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.isLive = this.isLive.bind(this);
    this.changePort = this.changePort.bind(this);
    this.pendingReactions = [];
    this.codex = new Codex();

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
          event: 'message',
          message
        });

        if (behaviour) {
          const run = behaviour.use();
          this.pendingReactions.push(
            Object.assign({
              subscription: run
                .reactions
                .subscribe({
                  next: (params) => {
                    this.ws.send(params.message);
                  },
                  complete: () => {
                    if (this.eventBus) {
                      this.eventBus.emit(
                        'server-reactions-end',
                        {
                          behaviourId: run.behaviourId,
                          scenarioId: run.scenarioId,
                          serverId: this.id
                        }
                      );
                    }
                  }
                })
            }, run)
          );

          if (this.eventBus) {
            this.eventBus.emit(
              'server-reactions-start',
              {
                behaviourId: run.behaviourId,
                scenarioId: run.scenarioId,
                serverId: this.id
              }
            );
          }
        }
      });

      this.ws.on('close', () => {
        this.clearPendingReactions();
        this.ws = null;
      });

      const behaviour = this.codex.matchBehaviour({
        event: 'connect',
      });

      if (behaviour) {
        const run = behaviour.use();
        this.pendingReactions.push(
          Object.assign({
            subscription: run
              .reactions
              .subscribe({
                next: (params) => {
                  this.ws.send(params.message);
                },
                complete: () => {
                  if (this.eventBus) {
                    this.eventBus.emit(
                      'server-reactions-end',
                      {
                        behaviourId: run.behaviourId,
                        scenarioId: run.scenarioId,
                        serverId: this.id
                      }
                    );
                  }
                }
              })
          }, run)
        );

        if (this.eventBus) {
          this.eventBus.emit(
            'server-reactions-start',
            {
              behaviourId: run.behaviourId,
              scenarioId: run.scenarioId,
              serverId: this.id
            }
          );
        }
      }
    });
  }

  clearPendingReactions() {
    if (this.pendingReactions.length) {
      this.pendingReactions.forEach((r) => {
        r.subscription.unsubscribe();

        if (this.eventBus) {
          this.eventBus.emit(
            'server-reactions-end',
            {
              behaviourId: r.behaviourId,
              scenarioId: r.scenarioId,
              serverId: this.id
            }
          );
        }
      });
      this.pendingReactions.length = 0;
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
