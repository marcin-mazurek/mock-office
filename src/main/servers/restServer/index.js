import express from 'express';

export default class RestServer {
  constructor(mocks) {
    this.load = this.load.bind(this);
    this.unload = this.unload.bind(this);
    this.add = this.add.bind(this);
    this.endpoints = mocks ? mocks.reduce(
        (prev, next) => {
          const reducedMocks = prev;
          reducedMocks[next.id] = next;
          return reducedMocks;
        }, {}
      ) : {};
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

  add(mocks) {
    const mocksAsMap = mocks.reduce(
        (prev, next) => {
          const reducedMocks = prev;
          reducedMocks[next.id] = next;
          return reducedMocks;
        }, {}
      ) || {};

    Object.assign(this.endpoints, mocksAsMap);
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