import { Server as WebSocketServer } from 'ws';
import https from 'https';
import http from 'http';
import fs from 'fs';
import atob from 'atob';
import Scenario from '../scenario';

export default class WSMockServer {
  constructor(config) {
    this.type = 'ws';
    this.port = config.port || 3010;
    this.name = config.name;
    this.id = config.id;
    this.scenario = new Scenario({ id: this.id });
    this.listening = false;
    this.isSecure = config.isSecure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;

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
      this.setupSocket(ws);

      const scene = this.scenario.findScene(
        {
          event: 'CLIENT_CONNECTED'
        }
      );

      if (scene) {
        this.scenario.play(scene.id, () => {
          let message;

          if (scene.taskPayload.type === 'b64') {
            message = atob(scene.taskPayload.message);
          } else {
            message = scene.taskPayload.message;
          }

          this.ws.send(message);
        });
      }
    });

    // globalEvents.on('SCENE_PLAYED', () => {
    //   const scene = this.scenario.findScene(
    //     {
    //       event: 'READY_FOR_EMIT'
    //     }
    //   );
    //
    //   if (scene) {
    //     this.scenario.play(scene.id, () => {
    //       let message;
    //
    //       if (scene.taskPayload.type === 'b64') {
    //         message = atob(scene.taskPayload.message);
    //       } else {
    //         message = scene.taskPayload.message;
    //       }
    //
    //       this.ws.send(message);
    //     });
    //   }
    // });
    //
    // globalEvents.on('TASK_REMOVED', () => {
    //   const scene = this.scenario.findScene(
    //     {
    //       event: 'READY_FOR_EMIT'
    //     }
    //   );
    //
    //   if (scene) {
    //     this.scenario.play(scene.id, () => {
    //       let message;
    //
    //       if (scene.taskPayload.type === 'b64') {
    //         message = atob(scene.taskPayload.message);
    //       } else {
    //         message = scene.taskPayload.message;
    //       }
    //
    //       this.ws.send(message);
    //     });
    //   }
    // });
  }

  addScene(desc) {
    return this.scenario.addScene(desc);
  }

  removeScene(taskId) {
    this.scenario.removeScene(taskId);
  }

  start(cb) {
    this.httpServer.listen(this.port);
    cb();
  }

  setupSocket(socket) {
    socket.on('message', (message) => {
      const scene = this.scenario.findScene(
        {
          event: 'RECEIVED_MESSAGE',
          message
        }
      );

      if (scene) {
        this.scenario.play(scene.id, () => {
          let msg;

          if (scene.taskPayload.type === 'b64') {
            msg = atob(scene.taskPayload.message);
          } else {
            msg = scene.taskPayload.message;
          }

          this.ws.send(msg);
        }, scene);
      }
    });

    socket.on('close', () => {
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
