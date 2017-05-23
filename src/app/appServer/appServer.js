import Ajv from 'ajv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import colors from 'colors/safe';
import configureAddServerMiddleware from './middlewares/addServerMiddleware';
import configureRemoveServerMiddleware from './middlewares/removeServerMiddleware';
import configureStartServerMiddleware from './middlewares/startServerMiddleware';
import configureStopServerMiddleware from './middlewares/stopServerMiddleware';
import configureEditServerMiddleware from './middlewares/editServerMiddleware';
import configureAddMockMiddleware from './middlewares/addMockMiddleware';
import configureRemoveMockMiddleware from './middlewares/removeMockMiddleware';
import configureExportMiddleware from './middlewares/exportMiddleware';

export const createAppServer = (serversManager) => {
  const ajv = new Ajv();
  const app = express();
  app.use(cors());

  app.post('/add-server', bodyParser.json(), configureAddServerMiddleware(ajv, serversManager));
  app.post('/remove-server', bodyParser.json(), configureRemoveServerMiddleware(ajv, serversManager));
  app.post('/start-server', bodyParser.json(), configureStartServerMiddleware(ajv, serversManager));
  app.post('/stop-server', bodyParser.json(), configureStopServerMiddleware(ajv, serversManager));
  app.post('/edit-server', bodyParser.json(), configureEditServerMiddleware(ajv, serversManager));
  app.post('/add-mock', bodyParser.json(), configureAddMockMiddleware(ajv, serversManager));
  app.post('/add-mock', bodyParser.json(), configureAddMockMiddleware(ajv, serversManager));
  app.post('/remove-mock', bodyParser.json(), configureRemoveMockMiddleware(ajv, serversManager));
  app.get('/export', configureExportMiddleware(serversManager));

  return app;
};

export const serveAppServer = (app, port, cb) => {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(colors.green(`App address: http://127.0.0.1:${port}`));
    if (typeof cb === 'function') {
      cb();
    }
  });
};
