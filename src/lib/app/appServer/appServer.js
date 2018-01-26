import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import colors from 'colors/safe';
import configureAddServerMiddleware from './middlewares/addServerMiddleware';
import configureRemoveServerMiddleware from './middlewares/removeServerMiddleware';
import configureStartServerMiddleware from './middlewares/startServerMiddleware';
import configureStopServerMiddleware from './middlewares/stopServerMiddleware';
import configureEditServerMiddleware from './middlewares/editServerMiddleware';
import addBehaviourMiddleware from './middlewares/addBehaviourMiddleware';
import configureRemoveBehaviourMiddleware from './middlewares/removeBehaviourMiddleware';
import configureExportMiddleware from './middlewares/exportMiddleware';
import configureGetBehaviourMiddleware from './middlewares/getBehaviourMiddleware';
import configurePersistentState from './configurePersistentState';
import configureGetStateMiddleware from './middlewares/getStateMiddleware';
import configureImportMiddleware from './middlewares/importMiddleware';
import ajv from './ajv';

const persistentState = configurePersistentState();
persistentState.restore();

export const createAppServer = () => {
  const app = express();
  app.use(cors());

  app.post('/add-server', bodyParser.json(), configureAddServerMiddleware(ajv));
  app.post('/remove-server', bodyParser.json(), configureRemoveServerMiddleware(ajv));
  app.post('/start-server', bodyParser.json(), configureStartServerMiddleware(ajv));
  app.post('/stop-server', bodyParser.json(), configureStopServerMiddleware(ajv));
  app.post('/edit-server', bodyParser.json(), configureEditServerMiddleware(ajv));
  app.post('/add-behaviour', bodyParser.json(), addBehaviourMiddleware);
  app.post('/remove-behaviour', bodyParser.json(), configureRemoveBehaviourMiddleware(ajv));
  app.get('/export', configureExportMiddleware());
  app.get('/behaviour', configureGetBehaviourMiddleware(ajv));
  app.get('/state', configureGetStateMiddleware());
  app.post('/import', bodyParser.json(), configureImportMiddleware(ajv));

  return app;
};

export const serveAppServer = (port, cb) => {
  createAppServer().listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(colors.green(`App address: http://127.0.0.1:${port}`));
    if (typeof cb === 'function') {
      cb();
    }
  });
};
