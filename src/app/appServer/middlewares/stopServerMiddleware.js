export default function configure(ajv, serversManager) {
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
      serversManager.stop(req.body.id)
        .then(
          () => {
            res.status(200).json({ id: req.body.id });
          },
          (err) => {
            res.status(400).json({ error: err });
          }
        );
    } else {
      res.status(400).json({ error: ajv.errors[0].message });
    }
  };
}
