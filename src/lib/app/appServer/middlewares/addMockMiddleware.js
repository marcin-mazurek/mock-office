import { serversManager } from '../../serversManager';

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

export default function configure(ajv) {
  return (req, res, next) => {
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

      req.body.mockId = server.addMock(req.body.scenario, req.body.mock);
      next();
    } catch (error) {
      res.status(400).json({ error });
    }
  };
}
