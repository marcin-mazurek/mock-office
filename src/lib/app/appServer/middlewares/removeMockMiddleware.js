import { serversManager } from '../../serversManager';

export default function configure(ajv) {
  return (req, res) => {
    const schema = {
      properties: {
        mockId: {
          type: 'string'
        },
        serverId: {
          type: 'string'
        }
      },
      required: ['mockId', 'serverId']
    };

    if (!ajv.validate(schema, req.body)) {
      res.json(ajv.errors);
    }

    const server = serversManager.getServer(req.body.serverId);

    if (!server) {
      res.status(404).end();
      return;
    }

    const mockRemoved = server.getScenario().removeMock(req.body.mockId);

    if (mockRemoved) {
      res.end();
    } else {
      res.status(404).end();
    }
  };
}
