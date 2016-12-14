import express from 'express';
import fs from 'fs';

export default class MockServer {
  constructor(pathToConfig) {
    const endpoints = JSON.parse(fs.readFileSync(pathToConfig));
    this.endpoints = endpoints || {};
    this.loaded = [];
    this.app = express();
    this.live = false;

    this.app.get('/*', (req, res) => {
      const payload = this.preparePayload(req);

      if (!this.live) {
        res.status(404).end();
        return;
      }

      if (payload) {
        res.json(payload);
      } else {
        res.status(404).end();
      }
    });
  }

  preparePayload(req) {
    let endpoint;
    this.loaded.forEach((loadedId) => {
      if (this.endpoints[loadedId].request.url === req.url) {
        endpoint = this.endpoints[loadedId];
      }
    });

    if (endpoint) {
      return endpoint.response.body;
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

  load(id) {
    this.loaded.push(id);
  }

  unload(id) {
    const indexOfMockToLoad = this.loaded.indexOf(endpointId => endpointId === id);
    this.loaded.splice(indexOfMockToLoad, 1);
  }
}
