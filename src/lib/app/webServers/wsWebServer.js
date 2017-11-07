import { Server as WebSocketServer } from 'ws';
import https from 'https';
import http from 'http';
import fs from 'fs';
import unique from 'cuid';

export default class WsWebServer {
  constructor(config, onTaskTrigger, onServerStop) {
    this.port = config.port || 3000;
    this.id = unique();
    this.secure = config.secure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.isLive = this.isLive.bind(this);
    this.changePort = this.changePort.bind(this);
    this.subscriptions = [];
    this.onTaskTrigger = onTaskTrigger;
    this.onServerStop = onServerStop;

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
        this.onTaskTrigger(
          {
            event: 'message',
            message
          },
          (task$) => {
            if (task$) {
              this.subscriptions.push(
                task$
                  .subscribe((params) => {
                    this.ws.send(params.message);
                  })
              );
            }
          }
        );
      });

      this.ws.on('close', () => {
        this.clearSubscriptions();
        this.ws = null;
      });

      this.onTaskTrigger(
        {
          event: 'connect',
        },
        (task$) => {
          if (task$) {
            this.subscriptions.push(
              task$
                .subscribe((params) => {
                  this.ws.send(params.message);
                })
            );
          }
        }
      );
    });
  }

  clearSubscriptions() {
    if (this.subscriptions.length) {
      this.subscriptions.forEach(s => s.unsubscribe());
      this.subscriptions.length = 0;
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

    this.clearSubscriptions();
    this.onServerStop();
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
