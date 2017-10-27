export default function configure(ajv, serversManager) {
  return (req, res) => {
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          minLength: 1
        },
        port: {
          type: 'number',
          minimum: 3000
        },
        type: {
          type: 'string',
          enum: ['http', 'ws']
        },
        secure: {
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
      const id = serversManager.add('server', req.body);

      const server = serversManager.getServer(id);
      res.json({
        name: server.name,
        port: server.port,
        type: server.type,
        secure: server.secure,
        scenario: server.getScenario().id,
        running: server.isLive(),
        id
      });

      return;
    }

    const splitPath = ajv.errors[0].dataPath.split('.');
    const param = splitPath[splitPath.length - 1];
    res.status(400).json({ error: `${param} ${[0].message}` });
  };
}
