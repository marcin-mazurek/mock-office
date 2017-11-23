import serversHub from '../../serversHub';
import { behaviourToResponse } from './transformers';

const schema = {
  properties: {
    serverId: {
      type: 'string'
    },
    behaviour: {
      type: 'object',
      properties: {
        event: {
          type: 'object',
          properties: {
            type: {
              type: 'string'
            }
          },
          required: ['type']
        },
        reactions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string'
              }
            },
            required: ['type']
          }
        }
      },
      required: ['reactions', 'event']
    }
  },
  required: ['serverId', 'behaviour']
};

export default function configure(ajv) {
  return (req, res) => {
    if (!ajv.validate(schema, req.body)) {
      res.status(400).json({ error: `${ajv.errors[0].dataPath} ${ajv.errors[0].message}` });
      return;
    }

    try {
      const server = serversHub.getServer(req.body.serverId);

      if (!server) {
        res.status(400).json({ error: 'Server not found.' });
        return;
      }

      const behaviour = server.webServer.codex.addBehaviour(req.body.behaviour);
      res.status(200).json(behaviourToResponse(behaviour));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
