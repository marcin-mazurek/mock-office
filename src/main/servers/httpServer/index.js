import express from 'express';
import queues from '../../queues';

const sendDefaultResponse = (res) => {
  res.status(404).end();
};

export default class HttpServer {
  constructor(config) {
    this.sockets = [];
    this.type = 'http';
    this.instance = express();
    this.live = false;
    this.port = config.port || 3000;
    this.name = config.name;
    this.id = config.id;
    this.triggerResponse = this.triggerResponse.bind(this);
  }

  triggerResponse(req, res) {
    const matchedResponse = queues.getResponse(this.id, { url: req.url });

    if (!matchedResponse) {
      res.status(404).end();
      return;
    }

    res.json(matchedResponse.body);
  }

  start(cb) {
    this.httpServer = this.instance.listen(this.port, cb);
  }

  respond() {
    this.httpServer.on('connection', socket => this.sockets.push(socket));

    this.instance.get('*', (req, res) => {
      if (!this.isLive()) {
        sendDefaultResponse(res);
        return;
      }

      this.triggerResponse(req, res);
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
