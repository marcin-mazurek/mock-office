export default function configure(ajv, serversManager) {
  const createResponseBody = server => ({
    name: server.name,
    port: server.port,
    type: server.type,
    secure: server.secure,
    id: server.id,
    scenario: server.getScenario().id,
    running: server.isLive(),
  });

  return (req, res) => {
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
    const server = serversManager.getServer(id);
    if (!server) {
      res.status(404).end();
      return;
    }
    if (name) {
      server.changeName(name);
    }

    if (port) {
      if (server.isLive()) {
        server.stop(() => {
          server.changePort(port);
          server.start(() => {
            res.status(200).json(createResponseBody(server));
          });
        });
      } else {
        server.changePort(port);
        res.status(200).json(createResponseBody(server));
      }
    } else {
      res.status(200).json(createResponseBody(server));
    }
  };
}
