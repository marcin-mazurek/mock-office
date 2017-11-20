import serversHub from '../../serversHub';

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
      return;
    }

    const server = serversHub.getServer(req.body.serverId);

    if (!server) {
      res.status(400).end();
      return;
    }

    if (server.webServer.codex.scenario.removeBehaviour(req.body.mockId)) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  };
}
