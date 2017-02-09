import { Server as WebSocketServer } from 'ws';
import https from 'https';
import http from 'http';
import fs from 'fs';
import queues from '../../queues';

export default class WSMockServer {
  constructor(config) {
    this.type = 'ws';
    this.port = config.port || 3010;
    this.name = config.name;
    this.id = config.id;
    this.listening = false;
    this.queueId = config.queueId;
    this.isSecure = config.isSecure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
  }

  start(cb) {
    const httpServer = this.secure ? https : http;
    let server;

    if (this.isSecure) {
      const options = {
        key: fs.readFileSync(this.keyPath),
        cert: fs.readFileSync(this.certPath)
      };

      server = httpServer.createServer(options);
    } else {
      server = httpServer.createServer();
    }

    this.httpServer = server.listen(this.port);
    this.wsServer = new WebSocketServer({ server: this.httpServer });
    this.listening = true;
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
      this.setupSocket(ws);
      queues.openTunnel(this.queueId, exp => this.ws.send(exp.message));
    });
    cb();
  }

  setupSocket(socket) {
    socket.on('message', message =>
      queues.runReadyTasks(
        this.queueId,
        { message }
      )
    );

    socket.on('close', () => {
      queues.closeTunnel(this.queueId);
      this.ws = undefined;
    });
  }

  stop(cb) {
    if (this.ws) {
      this.ws.close();
    }

    this.wsServer.close(() => {
      this.listening = false;
      this.httpServer.close(cb);
    });
  }

  addTask(task) {
    return queues.addTask(this.queueId, task);
  }

  isLive() {
    return this.listening;
  }
}
