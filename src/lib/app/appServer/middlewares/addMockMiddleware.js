const schema = {
  properties: {
    server: {
      type: 'string'
    },
    scenario: {
      type: 'string'
    },
    mock: {
      type: 'object'
    }
  },
  required: ['server', 'scenario', 'mock']
};

export default function configure(ajv, serversManager) {
  return (req, res) => {
    if (!ajv.validate(schema, req.body)) {
      res.status(400).json(ajv.errors);
      return;
    }

    try {
      const server = serversManager.getServer(req.body.server);
      if (!server) {
        res.status(404).end();
        return;
      }

      res.status(200).json({
        id: serversManager.add(
          'mock',
          req.body.mock,
          {
            scenarioId: req.body.scenario,
            serverId: req.body.server
          }
        )
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  };
}
