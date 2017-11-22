import serversHub from '../../serversHub';
import { behaviourToResponse } from './transformers';

const schema = {
  properties: {
    serverId: {
      type: 'string'
    },
    behaviour: {
      type: 'object'
    }
  },
  required: ['serverId', 'behaviour']
};

export default function configure(ajv) {
  return (req, res) => {
    if (!ajv.validate(schema, req.body)) {
      res.status(400).json(ajv.errors);
      return;
    }

    try {
      const server = serversHub.getServer(req.body.serverId);

      if (!server) {
        res.status(400).end();
        return;
      }

      const behaviour = server.webServer.codex.addBehaviour(req.body.behaviour);
      res.status(200).json(behaviourToResponse(behaviour));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
