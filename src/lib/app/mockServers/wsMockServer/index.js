import { Server as WebSocketServer } from 'ws';
import https from 'https';
import http from 'http';
import fs from 'fs';
import unique from 'cuid';
import { lensPath, view, set } from 'ramda';
import Scenario from '../../scenario';

export default class WsMockServer {
  constructor(config) {
    this.type = 'ws';
    this.port = config.port || 3000;
    this.name = config.name;
    this.id = unique();
    this.scenario = new Scenario();
    this.listening = false;
    this.secure = config.secure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
    this.getScenario = this.getScenario.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.isLive = this.isLive.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changePort = this.changePort.bind(this);
    this.subscriptions = [];

    const httpServer = this.secure ? https : http;

    if (this.secure) {
      const options = {
        key: fs.readFileSync(this.keyPath),
        cert: fs.readFileSync(this.certPath)
      };

      this.httpServer = httpServer.createServer(options);
    } else {
      this.httpServer = httpServer.createServer();
    }

    this.wsServer = new WebSocketServer({ server: this.httpServer });
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

      this.ws.on('message', (message) => {
        const mock = this.scenario.matchMock(
          {
            event: 'message',
            message
          }
        );

        if (mock) {
          const stream = this.scenario.play(mock.id);

          this.subscriptions.push(
            stream
              .subscribe((params) => {
                this.ws.send(params.message);
              })
          );
        }
      });

      this.ws.on('close', () => {
        this.clearSubscriptions();
        this.scenario.cancelPendingMocks();
        this.ws = null;
      });

      const mock = this.scenario.matchMock(
        {
          event: 'connect'
        }
      );

      if (mock) {
        const stream = this.scenario.play(mock.id);

        this.subscriptions.push(
          stream
            .subscribe((params) => {
              this.ws.send(params.message);
            })
        );
      }
    });
  }

  clearSubscriptions() {
    if (this.subscriptions.length) {
      this.subscriptions.forEach(s => s.unsubscribe());
      this.subscriptions.length = 0;
    }
  }

  getScenario() {
    return this.scenario;
  }

  start(cb) {
    this.httpServer.listen(this.port, cb);
  }

  stop(cb) {
    this.clearSubscriptions();
    if (this.ws) {
      this.ws.terminate();
    }
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

  addMock(scenarioId, mockConfig) {
    /* eslint-disable no-param-reassign */
    // set default values
    const eventLens = lensPath(['trigger', 'event']);
    if (!view(eventLens, mockConfig)) {
      mockConfig = set(eventLens, 'message', mockConfig);
    }

    /* eslint-enable no-param-reassign */

    return this.scenario.addMock({
      requirements: mockConfig.trigger,
      tasks: mockConfig.messages,
      loadedCounter: mockConfig.loadedCounter
    });
  }

  changePort(port) {
    this.port = port;
  }

  getMock(scenarioId, mockId) {
    return this.scenario.getMock(mockId);
  }
}
