import { Server as WebSocketServer } from 'ws';
import https from 'https';
import http from 'http';
import fs from 'fs';
import { EventEmitter } from 'events';
import Queue from '../queue';

export default class WSMockServer {
  constructor(config) {
    this.ee = new EventEmitter();
    this.queue = new Queue({ ee: this.ee });
    this.type = 'ws';
    this.port = config.port || 3010;
    this.name = config.name;
    this.id = config.id;
    this.listening = false;
    this.isSecure = config.isSecure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
  }

  addTask(task) {
    return this.queue.addTask(task);
  }

  removeTask(taskId) {
    this.queue.removeTask(taskId);
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
      this.queue.openConnection(task => this.ws.send(task.taskPayload.message));
    });
    cb();
  }

  setupSocket(socket) {
    socket.on('message', message => this.queue.runReadyTask({ message }));

    socket.on('close', () => {
      this.queue.closeConnection();
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

  isLive() {
    return this.listening;
  }
}
