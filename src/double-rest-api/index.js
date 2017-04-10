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

app.post('/remove-server', bodyParser.json(), (req, res) => {
  const schema = {
    properties: {
      id: {
        type: 'string'
      }
    },
    required: ['id']
  };

  if (ajv.validate(schema, req.body)) {
    double.remove(req.body.id)
      .then(
        () => {
          res.status(200).end();
        },
        () => {
          res.status(400).send(`Cannot found server with id ${req.body.id}.`);
        }
      );
  } else {
    res.json(ajv.errors);
  }
});

app.post('/start-server', bodyParser.json(), (req, res) => {
  const schema = {
    properties: {
      id: {
        type: 'string'
      }
    },
    required: ['id']
  };

  if (ajv.validate(schema, req.body)) {
    const serverToStart = double.find(req.body.id);

    if (!serverToStart) {
      res.status(400).send(`Cannot found server with id ${req.body.id}.`);
    } else {
      serverToStart.start(
        () => {
          res.status(200).end();
        }
      );
    }
  } else {
    res.json(ajv.errors);
  }
});

app.post('/stop-server', bodyParser.json(), (req, res) => {
  const schema = {
    properties: {
      id: {
        type: 'string'
      }
    },
    required: ['id']
  };

  if (ajv.validate(schema, req.body)) {
    const serverToStop = double.find(req.body.id);

    if (!serverToStop) {
      res.status(400).send(`Cannot found server with id ${req.body.id}.`);
    } else {
      serverToStop.stop(
        () => {
          res.status(200).end();
        }
      );
    }
  } else {
    res.json(ajv.errors);
  }
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

app.listen(3060, () => {
  // eslint-disable-next-line no-console
  console.log('rest-api is running');
});
