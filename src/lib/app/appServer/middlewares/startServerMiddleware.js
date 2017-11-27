import serversHub from '../../serversHub';

export default function configure(ajv) {
  return (req, res) => {
    const schema = {
      properties: {
        id: {
          type: 'string'
        }
      },
      required: ['id']
    };

    if (ajv.validate(schema, req.body)) {
      serversHub
        .getServer(req.body.id).webServer
        .start()
        .then(
          () => {
            res.status(200).json({ id: req.body.id });
          },
          (err) => {
            console.log(err);
            res.status(500).json({ error: err });
          }
        );
    } else {
      res.status(400).json({ error: ajv.errors[0].message });
    }
  };
}
