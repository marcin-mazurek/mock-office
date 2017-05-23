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
  };
}
