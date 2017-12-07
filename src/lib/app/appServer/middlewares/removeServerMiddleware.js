import serversHub from '../../serversHub';

export default function configure(ajv) {
  return (req, res) => {
    const schema = {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        }
      },
      required: ['id']
    };

    if (ajv.validate(schema, req.body)) {
      serversHub.remove(req.body.id)
        .then(
          () => {
            res.status(200).end();
          },
          () => {
            res.status(404).end();
          }
        );
    } else {
      res.status(400).json(ajv.errors[0]);
    }
  };
}
