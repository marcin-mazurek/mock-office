import express from 'express';
import fs from 'fs';

export default class MockServer {
  constructor(pathToConfig) {
    const endpoints = JSON.parse(fs.readFileSync(pathToConfig));
    this.endpoints = endpoints || {};
    this.app = express();
    this.live = false;

    this.app.get('/*', (req, res) => {
      const payload = this.preparePayload(req);

      if (!this.live) {
        res.status(404).end();
        return;
      }

      if (payload) {
        res.set('Content-Type', 'application/json');
        res.send(payload);
      } else {
        res.status(404).end();
      }
    });
  }

  preparePayload(req) {
    const endpoint = this.endpoints[req.url];

    if (endpoint) {
      return endpoint.payload;
    }

    return undefined;
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
