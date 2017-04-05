import { Server as WebSocketServer } from 'ws';
import https from 'https';
import http from 'http';
import fs from 'fs';
import unique from 'node-unique';
import Scenario from '../scenario';

export default class WSMockServer {
  constructor(config) {
    this.type = 'ws';
    this.port = config.port || 3010;
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
    this.setupSocket = this.setupSocket.bind(this);
    this.stop = this.stop.bind(this);
    this.isLive = this.isLive.bind(this);

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

    const setup = (ws) => {
      this.ws = ws;
      this.setupSocket(ws);

      const scene = this.scenario.findScene(
        {
          event: 'CLIENT_CONNECTED'
        }
      );

      if (scene) {
        this.scenario.play(scene.id, (params) => {
          this.ws.send(params.payload.message);
        });
      }
    };

    this.wsServer.on('connection', (ws) => {
      // support only one open socket
      if (this.ws) {
        ws.close();
        return;
      }

      setup(ws);
    });
  }

  getScenario() {
    return this.scenario;
  }

  start(cb) {
    this.httpServer.listen(this.port);
    cb();
  }

  setupSocket() {
    this.ws.on('message', (message) => {
      const scene = this.scenario.findScene(
        {
          event: 'RECEIVED_MESSAGE',
          message
        }
      );

      if (scene) {
        this.scenario.play(scene.id, (params) => {
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
      this.scenario.cancelPendingScenes();
      this.ws = undefined;
    });
  }

  stop(cb) {
    if (this.ws) {
      this.ws.close();
    }

    this.wsServer.close(() => {
      this.httpServer.close(cb);
    });
  }

  isLive() {
    return this.httpServer.listening;
  }
}
