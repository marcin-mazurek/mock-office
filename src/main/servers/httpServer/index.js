import express from 'express';
import R from 'ramda';
import queues from '../../queues';

const sendDefaultResponse = res => () => res.status(404).end();
const sendResponse = R.curry((res, response) => res.json(response.body));
const triggerResponse = R.curry((serverId, req, res) => (
  queues.prepareResponse(serverId, { url: req.url })
    .then(sendResponse(res))
    .catch(sendDefaultResponse(res))
));

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
    this.httpServer = this.instance.listen(this.port, () => {
      this.httpServer.on('connection', socket => this.sockets.push(socket));
      this.instance.get('*', triggerResponse(this.id));
      cb();
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
