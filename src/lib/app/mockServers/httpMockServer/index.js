import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import unique from 'cuid';
import bodyParser from 'body-parser';
import Scenario from '../../scenario/index';

export const send = (req, res) => (params) => {
  if (req.headers.origin) {
    res.set('Access-Control-Allow-Origin', req.headers.origin);
  }

  if (params.headers) {
    res.set(params.headers);
  }

  if (params.status) {
    res.status(params.status);
  }

  res.json(params.payload);
};

export default class HttpMockServer {
  constructor(config) {
    this.id = unique();
    this.emitter = config.emitter.extend({ serverId: this.id });
    this.scenario = new Scenario({ emitter: this.emitter });
    this.sockets = [];
    this.type = 'http';
    this.port = config.port || 3000;
    this.name = config.name;
    this.secure = config.secure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
    this.saveSocketRef = this.saveSocketRef.bind(this);
    this.start = this.start.bind(this);
    this.saveSocketRef = this.saveSocketRef.bind(this);
    this.destroyOpenSockets = this.destroyOpenSockets.bind(this);
    this.stop = this.stop.bind(this);
    this.isLive = this.isLive.bind(this);
    this.respond = this.respond.bind(this);
    this.getScenario = this.getScenario.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changePort = this.changePort.bind(this);
    const httpServer = this.secure ? https : http;
    const app = express();
    app.use(bodyParser.json());
    app.use('*', this.respond);

    if (this.secure) {
      const credentials = {
        key: fs.readFileSync(this.keyPath),
        cert: fs.readFileSync(this.certPath)
      };

      this.httpServer = httpServer.createServer(credentials, app);
    } else {
      this.httpServer = httpServer.createServer(app);
    }

    // we need store sockets to destroy them manually before closing server
    this.httpServer.on('connection', this.saveSocketRef);
  }

  getScenario() {
    return this.scenario;
  }

  respond(req, res) {
    const requirements = {
      path: req.originalUrl,
      method: req.method,
      headers: req.headers
    };

    if (req.method === 'POST') {
      requirements.payload = req.body;
    }
    const mock = this.scenario.matchMock(requirements);

    if (mock) {
      this.scenario.play(mock.id, send(req, res));
    } else {
      res.set('Access-Control-Allow-Origin', req.headers.origin)
        .status(404).send('Sorry, we cannot find mock.');
    }
  }

  start(onSuccess, onError) {
    this.httpServer.listen(this.port, onSuccess);
    this.httpServer.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        onError(`Port ${err.port} is in use. Choose different port.`);
      }
    });
  }

  saveSocketRef(socket) {
    this.sockets.push(socket);
  }

  destroyOpenSockets() {
    this.sockets.forEach(socket => socket.destroy());
    this.sockets.length = 0;
  }

  stop(cb) {
    this.scenario.cancelPendingMocks();
    // Browsers can keep connection open, thus callback after
    // HttpMockServer.stop cant be called if there are sockets
    // still open, thus we need to ensure that all sockets are
    // destroyed
    // https://nodejs.org/api/net.html#net_server_close_callback
    this.destroyOpenSockets();
    this.httpServer.close(cb);
  }

  rename(name) {
    this.name = name;
  }

  isLive() {
    return this.httpServer.listening;
  }

  changeName(name) {
    this.name = name;
  }

  changePort(port) {
    this.port = port;
  }

  addMock(scenarioId, mockConfig) {
    /* eslint-disable no-param-reassign */
    mockConfig.request = mockConfig.request || {};
    mockConfig.response = mockConfig.response || {};

    if (!mockConfig.request.method) {
      mockConfig.request.method = 'GET';
    }

    if (!mockConfig.request.path) {
      mockConfig.request.path = '/';
    }

    if (!mockConfig.response.params) {
      mockConfig.response.params = {};
    } else if (!mockConfig.response.params.status) {
      mockConfig.response.params.status = 200;
    }

    return this.scenario.addMock({
      requirements: mockConfig.request,
      tasks: [mockConfig.response],
      loadedCounter: mockConfig.loadedCounter
    });
    /* eslint-enable no-param-reassign */
  }

  getMock(scenarioId, mockId) {
    return this.scenario.getMock(mockId);
  }
}
