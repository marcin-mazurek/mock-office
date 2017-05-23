export default function configure(ajv, serversManager) {
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
}
