import Ajv from 'ajv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Server as WebSocketServer } from 'ws';
import ServersManager from './servers-manager';
import { addListener } from './servers-manager/emitter';

export default () => {
  const ajv = new Ajv();
  const app = express();
  app.use(cors());
  const serversManager = new ServersManager();

  app.post('/add-server', bodyParser.json(), (req, res) => {
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        port: {
          type: 'number'
        },
        type: {
          type: 'string',
          enum: ['http', 'ws']
        },
        isSecure: {
          type: 'boolean'
        },
        keyPath: {
          type: 'string'
        },
        certPath: {
          type: 'string'
        }
      },
      required: [
        'name',
        'type'
      ]
    };

    if (ajv.validate(schema, req.body)) {
      const id = serversManager.add(
        req.body.name,
        req.body.port,
        req.body.type,
        req.body.isSecure,
        req.body.keyPath,
        req.body.certPath
      );

      res.json({
        id
      });

      return;
    }

    res.json(ajv.errors);
  });

  app.post('/remove-server', bodyParser.json(), (req, res) => {
    const schema = {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        }
      },
      required: ['id']
    };

    if (ajv.validate(schema, req.body)) {
      serversManager.remove(req.body.id)
        .then(
          () => {
            res.status(200).end();
          },
          () => {
            res.status(404).end();
          }
        );
    } else {
      res.json(ajv.errors);
    }
  });

  app.post('/start-server', bodyParser.json(), (req, res) => {
    const schema = {
      properties: {
        id: {
          type: 'string'
        }
      },
      required: ['id']
    };

    if (ajv.validate(schema, req.body)) {
      const serverToStart = serversManager.find(req.body.id);

      if (!serverToStart) {
        res.status(404).end();
      } else {
        serverToStart.start(
          () => {
            res.status(200).end();
          }
        );
      }
    } else {
      res.json(ajv.errors);
    }
  });

  app.post('/stop-server', bodyParser.json(), (req, res) => {
    const schema = {
      properties: {
        id: {
          type: 'string'
        }
      },
      required: ['id']
    };

    if (ajv.validate(schema, req.body)) {
      const serverToStop = serversManager.find(req.body.id);

      if (!serverToStop) {
        res.status(404).end();
      } else {
        serverToStop.stop(
          () => {
            res.status(200).end();
          }
        );
      }
    } else {
      res.json(ajv.errors);
    }
  });

  app.post('/add-scene', bodyParser.json(), (req, res) => {
    const schema = {
      properties: {
        serverId: {
          type: 'string'
        },
        scene: {
          type: 'object',
          properties: {
            title: {
              type: 'string'
            },
            requirements: {
              type: 'object'
            },
            reuse: {
              type: 'string'
            },
            parts: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string'
                  },
                  type: {
                    type: 'string'
                  },
                  payload: {
                    type: 'object'
                  },
                  delay: {
                    type: 'number'
                  }
                },
                required: ['type']
              }
            }
          },
          required: ['parts']
        }
      },
      required: ['serverId', 'scene']
    };

    if (ajv.validate(schema, req.body)) {
      const server = serversManager.find(req.body.serverId);

      if (!server) {
        res.status(404).end();
        return;
      }

      const sceneId = server.getScenario().addScene(req.body.scene);
      const parts = server.getScenario().find(sceneId).parts.map(part => part.id);

      res.status(200).json({
        id: sceneId,
        parts
      });
      return;
    }

    res.json(ajv.errors);
  });

  app.post('/remove-scene', bodyParser.json(), (req, res) => {
    const schema = {
      properties: {
        sceneId: {
          type: 'string'
        },
        serverId: {
          type: 'string'
        }
      },
      required: ['sceneId', 'serverId']
    };

    if (!ajv.validate(schema, req.body)) {
      res.json(ajv.errors);
    }

    const server = serversManager.find(req.body.serverId);

    if (!server) {
      res.status(404).end();
      return;
    }

    const sceneRemoved = server.getScenario().removeScene(req.body.sceneId);

    if (sceneRemoved) {
      res.end();
    } else {
      res.status(404).end();
    }
  });

  app.get('/state', (req, res) => {
    const state = {
      servers: serversManager.servers.map(server => ({
        running: server.isLive(),
        name: server.name,
        type: server.type,
        port: server.port,
        id: server.id,
        scenes: server.getScenario().scenes.map(scene => ({
          id: scene.id,
          title: scene.title,
          interval: scene.interval,
          reuse: scene.reuse,
          quantity: scene.quantity,
          delay: scene.delay,
          requirements: scene.requirements,
          parts: scene.parts.map(part => ({
            id: part.id,
            pending: part.pending,
            title: part.scheduleDetails.title,
            type: part.scheduleDetails.type,
            delay: part.scheduleDetails.delay
          }))
        }))
      }))
    };

    res.json(state);
  });

  app.listen(3060, () => {
    // eslint-disable-next-line no-console
    console.log('rest-api is running');
  });

  const wsServer = new WebSocketServer({ port: 3061 });
  let sockets = [];

  const broadcast = (event, args) => sockets.forEach(
    socket => socket.send(JSON.stringify(Object.assign({ event }, args)))
  );

  addListener('SCENE_REMOVED',
    args => broadcast('SCENE_REMOVED', args)
  );

  addListener('SCENE_START',
    args => broadcast('SCENE_START', args)
  );

  addListener('SCENE_END',
    args => broadcast('SCENE_END', args)
  );

  addListener('SCENE_CANCEL',
    args => broadcast('SCENE_CANCEL', args)
  );

  addListener('SCENE_REMOVED_AFTER_USE',
    args => broadcast('SCENE_REMOVED_AFTER_USE', args)
  );

  addListener('SCENE_PART_START',
    args => broadcast('SCENE_PART_START', args)
  );

  addListener('SCENE_PART_END',
    args => broadcast('SCENE_PART_END', args)
  );

  addListener('SCENE_PART_CANCEL',
    args => broadcast('SCENE_PART_CANCEL', args)
  );

  addListener('RESTORE_STATE',
    () => broadcast('RESTORE_STATE')
  );

  wsServer.on('connection', (ws) => {
    sockets.push(ws);

    ws.on('close', () => {
      sockets = sockets.filter(soc => soc !== ws);
    });
  });
};
