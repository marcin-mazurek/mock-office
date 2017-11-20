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
    mock: {
      type: 'object'
    }
  },
  required: ['server', 'scenario', 'mock']
};

export default function configure(ajv) {
  return (req, res) => {
    if (!ajv.validate(schema, req.body)) {
      res.status(400).json(ajv.errors);
      return;
    }

    try {
      const server = serversHub.getServer(req.body.server);

      if (!server) {
        res.status(400).end();
        return;
      }

      const mock = server.webServer.player.scenario.addMock(req.body.mock);
      res.status(200).json(mockToResponse(mock));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
