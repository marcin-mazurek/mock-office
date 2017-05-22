import Ajv from 'ajv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import colors from 'colors/safe';
import configureAddServerMiddleware from './addServerMiddleware';

export const handleEditServer = serversManager => (req, res) => {
  const ajv = new Ajv();
  const schema = {
    properties: {
      name: {
        type: 'string',
        minLength: 1
      },
      port: {
        type: 'number',
        minimum: 3000
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

  const addServerMiddleware = configureAddServerMiddleware(ajv, serversManager);

  app.post('/add-server', bodyParser.json(), addServerMiddleware);

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

  app.post('/add-mock', bodyParser.json(), (req, res) => {
    const schema = {
      properties: {
        server: {
          type: 'string'
        },
        scenario: {
          type: 'string'
        },
        mock: {
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
            tasks: {
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
          required: ['tasks']
        }
      },
      required: ['server', 'scenario', 'mock']
    };

    if (ajv.validate(schema, req.body)) {
      const server = serversManager.find(req.body.server);
      if (!server) {
        res.status(404).end();
        return;
      }

      const mockId = server.getScenario().addMock(req.body.mock);
      const tasks = server.getScenario().find(mockId).tasks.map(part => part.id);
      res.status(200).json({
        id: mockId,
        tasks
      });
      return;
    }

    const splitPath = ajv.errors[0].dataPath.split('.');
    const param = splitPath[splitPath.length - 1];
    res.status(400).json({ error: `${param} ${ajv.errors[0].message}` });
  });

  app.post('/remove-mock', bodyParser.json(), (req, res) => {
    const schema = {
      properties: {
        mockId: {
          type: 'string'
        },
        serverId: {
          type: 'string'
        }
      },
      required: ['mockId', 'serverId']
    };

    if (!ajv.validate(schema, req.body)) {
      res.json(ajv.errors);
    }

    const server = serversManager.find(req.body.serverId);

    if (!server) {
      res.status(404).end();
      return;
    }

    const mockRemoved = server.getScenario().removeMock(req.body.mockId);

    if (mockRemoved) {
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
