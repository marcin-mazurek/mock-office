import express from 'express';
import { Double } from '../double';

const app = express();
const double = new Double();

app.post('/add-server', (req, res) => {
  const id = double.add(req.body);
  res.send(id);
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
