import express from 'express';
import queues from '../../queues';

export default class HttpServer {
  constructor(config) {
    this.sockets = [];
    this.type = 'http';
    this.instance = express();
    this.live = false;
    this.port = config.port || 3000;
    this.name = config.name;
    this.id = config.id;
  }

  start(cb) {
    this.httpServer = this.instance.listen(this.port, cb);
  }

  respond() {
    this.httpServer.on('connection', socket => this.sockets.push(socket));

    this.instance.get('*', (req, res) => {
      if (!this.isLive()) {
        res.status(404).end();
        return;
      }

      const matchedResponse = queues.getResponse(this.id, req);

      if (!matchedResponse) {
        res.status(404).end();
        return;
      }

      res.json(matchedResponse.body);
    });
  }

  stop(cb) {
    this.sockets.forEach(socket => socket.destroy());
    this.sockets.length = 0;
    this.httpServer.close(cb);
  }

  isLive() {
    return this.httpServer ? this.httpServer.listening : false;
  }
}
