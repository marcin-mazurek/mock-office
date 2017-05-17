import { Server as WebSocketServer } from 'ws';
import https from 'https';
import http from 'http';
import fs from 'fs';
import unique from 'cuid';
import Scenario from '../../scenario/index';

export default class WsMockServer {
  constructor(config) {
    this.type = 'ws';
    this.port = config.port || 3000;
    this.name = config.name;
    this.id = unique();
    this.emitter = config.emitter.extend({ serverId: this.id });
    this.scenario = new Scenario({ emitter: this.emitter });
    this.listening = false;
    this.isSecure = config.isSecure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
    this.emitter = config.emitter;
    this.getScenario = this.getScenario.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.isLive = this.isLive.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changePort = this.changePort.bind(this);

    const httpServer = this.secure ? https : http;

    if (this.isSecure) {
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
        const mock = this.scenario.findMock(
          {
            event: 'RECEIVED_MESSAGE',
            message
          }
        );

        if (mock) {
          this.scenario.play(mock.id, (params) => {
            this.ws.send(params.payload.message, (err) => {
              if (err) {
                // eslint-disable-next-line no-console
                console.log('socket is closed so we cant send message. All tasks will be canceled on close event');
              }
            });
          });
        }
      });

      this.ws.on('close', () => {
        this.scenario.cancelPendingMocks();
        this.ws = undefined;
      });

      const mock = this.scenario.findMock(
        {
          event: 'CLIENT_CONNECTED'
        }
      );

      if (mock) {
        this.scenario.play(mock.id, (params) => {
          this.ws.send(params.payload.message);
        });
      }
    });
  }

  getScenario() {
    return this.scenario;
  }

  start(cb) {
    this.httpServer.listen(this.port, cb);
  }

  stop(cb) {
    if (this.ws) {
      this.ws.close();
    }

    this.wsServer.close(() => {
      this.httpServer.close(cb);
    });
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
}
