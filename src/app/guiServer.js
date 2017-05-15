import express from 'express';
import path from 'path';
import colors from 'colors/safe';

export function createGuiServer() {
  const serveStatic = express.static(path.resolve(__dirname, './gui'));
  const app = express();
  app.use(serveStatic);

  return app;
}

export function serveGuiServer(app, port) {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(colors.green(`GUI address: http://127.0.0.1:${port}`));
  });
}
