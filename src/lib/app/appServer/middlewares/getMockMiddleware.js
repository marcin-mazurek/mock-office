import serversHub from '../../serversHub';
import { mockToResponse } from './transformers';

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

export default function configure(ajv) {
  return (req, res) => {
    if (!ajv.validate(schema, req.query)) {
      res.status(400).json(ajv.errors);
      return;
    }

    try {
      const server = serversHub.getServer(req.query.server);

      if (!server) {
        res.status(404).end();
        return;
      }

      const mock = server.webServer.player.scenario.mocks.find(m => m.id === req.query.id);
      if (!mock) {
        res.status(404).end();
        return;
      }

      res.status(200).json(mockToResponse(mock));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
