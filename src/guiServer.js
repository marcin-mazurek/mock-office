import express from 'express';
import path from 'path';

export function createGuiServer() {
  const serveStatic = express.static(path.resolve(__dirname, './gui'));
  const app = express();
  app.use(serveStatic);

  return app;
}

export function serveGuiServer(app, port) {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`GUI address: http://127.0.0.1:${port}`);
  });
}
