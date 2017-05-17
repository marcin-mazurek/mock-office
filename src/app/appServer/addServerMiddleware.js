export default function configure(ajv, serversManager) {
  return (req, res) => {
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          minLength: 1
        },
        port: {
          type: 'number',
          minimum: 3000
        },
        type: {
          type: 'string',
          enum: ['http', 'ws']
        },
        isSecure: {
          type: 'boolean'
        },
        keyPath: {
          type: 'string'
        },
        certPath: {
          type: 'string'
        }
      },
      required: [
        'name',
        'type'
      ]
    };

    if (ajv.validate(schema, req.body)) {
      const id = serversManager.add(
        req.body.name,
        req.body.port,
        req.body.type,
        req.body.isSecure,
        req.body.keyPath,
        req.body.certPath
      );

      res.json({
        name: req.body.name,
        port: req.body.port,
        type: req.body.type,
        isSecure: req.body.isSecure,
        id
      });

      return;
    }

    const splitPath = ajv.errors[0].dataPath.split('.');
    const param = splitPath[splitPath.length - 1];
    res.status(400).json({ error: `${param} ${ajv.errors[0].message}` });
  };
}
