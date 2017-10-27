const schema = {
  properties: {
    server: {
      type: 'string'
    },
    scenario: {
      type: 'string'
    },
    id: {
      type: 'string'
    }
  },
  required: ['server', 'scenario', 'id']
};

export default function configure(ajv, serversManager) {
  return (req, res) => {
    if (!ajv.validate(schema, req.query)) {
      res.status(400).json(ajv.errors);
      return;
    }

    try {
      const server = serversManager.getServer(req.query.server);
      if (!server) {
        res.status(404).end();
        return;
      }

      const mock = server.getMock(req.query.scenario, req.query.id);
      if (!mock) {
        res.status(404).end();
        return;
      }

      res.status(200).json(mock);
    } catch (error) {
      res.status(400).json({ error });
    }
  };
}
