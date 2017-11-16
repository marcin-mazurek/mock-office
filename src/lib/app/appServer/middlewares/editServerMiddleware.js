import serversHub from '../../serversHub';

export default function configure(ajv) {
  const createResponseBody = server => ({
    name: server.name,
    port: server.webServer.port,
    type: server.type,
    secure: server.webServer.secure,
    id: server.id,
    scenario: server.player.scheduled.id,
    running: server.webServer.isLive(),
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
    const server = serversHub.getServer(id);
    if (!server) {
      res.status(404).end();
      return;
    }
    if (name) {
      server.name = name;
    }

    if (port) {
      server.webServer.changePort(port).then(() => {
        res.status(200).json(createResponseBody(server));
      });
    } else {
      res.status(200).json(createResponseBody(server));
    }
  };
}
