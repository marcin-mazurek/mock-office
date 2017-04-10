import Ajv from 'ajv';
import express from 'express';
import bodyParser from 'body-parser';
import Double from '../double';

const ajv = new Ajv();
const app = express();
const double = new Double();

app.post('/add-server', bodyParser.json(), (req, res) => {
  const schema = {
    properties: {
      name: {
        type: 'string'
      },
      port: {
        type: 'number'
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
    const id = double.add(
      req.body.name,
      req.body.port,
      req.body.type,
      req.body.isSecure,
      req.body.keyPath,
      req.body.certPath
    );

    res.json({
      id
    });

    return;
  }

  res.json(ajv.errors);
});

app.post('/remove-server', (req, res) => {
  double.remove(req.body.id);
  res.end();
});

app.post('/add-scene', (req, res) => {
  const server = double.find(req.body.serverId);
  const sceneId = server.getScenario().addScene(req.body.scene);
  res.end(sceneId);
});

app.post('/remove-scene', (req, res) => {
  double.find(req.body.serverId).getScenario().removeScene(req.body.sceneId);
  res.end();
});

app.post('/start-server', (req, res) => {
  double.find(req.body.id).start(() => {
    res.end();
  });
});

app.post('/stop-server', (req, res) => {
  double.find(req.body.id).stop(() => {
    res.end();
  });
});

app.listen(3060, () => {
  // eslint-disable-next-line no-console
  console.log('rest-api is running');
});
