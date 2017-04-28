import Ajv from 'ajv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import colors from 'colors/safe';

export const handleEditServer = serversManager => (req, res) => {
  const ajv = new Ajv();
  const schema = {
    properties: {
      name: {
        type: 'string'
      },
      port: {
        type: 'number'
      },
      id: {
        type: 'string'
      }
    },
    required: ['id']
  };

  if (!ajv.validate(schema, req.body)) {
    const splitPath = ajv.errors[0].dataPath.split('.');
    const param = splitPath[splitPath.length - 1];
    res.status(400).json({ error: `${param} ${ajv.errors[0].message}` });
    return;
  }

  const { id, name, port } = req.body;
  const server = serversManager.find(id);
  if (!server) {
    res.status(404).end();
    return;
  }

  const response = {
    id
  };
  if (name) {
    server.changeName(name);
    response.name = name;
  }

  if (port) {
    if (server.isLive()) {
      server.stop(() => {
        server.changePort(port);
        server.start(() => {
          response.port = port;
          res.status(200).json(response);
        });
      });
    } else {
      server.changePort(port);
      response.port = port;
      res.status(200).json(response);
    }
  } else {
    res.status(200).json(response);
  }
};

export const createAppServer = (serversManager) => {
  const ajv = new Ajv();
  const app = express();
  app.use(cors());

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
      serversManager.start(req.body.id)
        .then(
          (started) => {
            if (started) {
              res.status(200).json({ id: req.body.id });
            } else {
              res.status(404).end();
            }
          },
          (err) => {
            res.status(400).json({ error: err });
          }
        );
    } else {
      res.status(400).json({ error: ajv.errors[0].message });
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

    const splitPath = ajv.errors[0].dataPath.split('.');
    const param = splitPath[splitPath.length - 1];
    res.status(400).json({ error: `${param} ${ajv.errors[0].message}` });
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

  app.get('/export', (req, res) => {
    res
      .set({
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename=export.json'
      })
      .write(JSON.stringify(serversManager.getState()), 'utf-8', () => {
        res.end();
      });
  });

  app.post('/edit-server', bodyParser.json(), handleEditServer(serversManager));

  return app;
};

export const serveAppServer = (app, port, cb) => {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(colors.green(`App address: http://127.0.0.1:${port}`));
    if (typeof cb === 'function') {
      cb();
    }
  });
};
