import express from 'express';
import path from 'path';
import colors from 'colors/safe';

export function createGuiServer() {
  const staticAssetsMiddleware = (req, res) => {
    res.sendFile(path.resolve(__dirname, `../gui/${req.originalUrl}`));
  };
  const reactAppMiddleware = (req, res) => {
    res.sendFile(path.resolve(__dirname, '../gui/index.html'));
  };
  const app = express();
  app.use('/static/*', staticAssetsMiddleware);
  app.use('*', reactAppMiddleware);
  return app;
}

export function serveGuiServer(app, port) {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(colors.green(`GUI address: http://127.0.0.1:${port}`));
  });
}
