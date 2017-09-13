export default function configure(ajv, serversManager) {
  return (req, res) => {
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
                  },
                  params: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string'
                      }
                    }
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
      const scenario = server.getScenario();
      const mockId = scenario.addMock(req.body.mock);
      const mock = scenario.find(mockId);
      res.status(200).json({
        mock: {
          id: mock.id,
          quantity: mock.quantity,
          tasks: mock.tasks.map(task => Object.assign({ id: task.id }, task.scheduleDetails)),
          title: mock.title,
          requirements: mock.requirements,
          status: mock.status
        },
        scenario: scenario.id
      });
      return;
    }

    const splitPath = ajv.errors[0].dataPath.split('.');
    const param = splitPath[splitPath.length - 1];
    res.status(400).json({ error: `${param} ${ajv.errors[0].message}` });
  };
}
