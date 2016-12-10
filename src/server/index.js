import express from 'express';

export default class MockServer {
  constructor() {
    this.app = express();
    this.live = false;

    this.app.get('/*', (req, res) => {
      res.send('Hi from mockee!');
    });
  }

  start(cb) {
    this.server = this.app.listen(3000, cb);
    this.live = true;
  }

  stop(cb) {
    this.server.close(cb);
    this.live = false;
  }

  isLive() {
    return this.live;
  }
}
