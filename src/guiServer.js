import express from 'express';
import path from 'path';
import colors from 'colors/safe';

export function createGuiServer() {
  const app = express();
  app.get('*', (req, res) => {
    res.send(path.resolve(__dirname, './gui/index.html'));
  });

  return app;
}

export function serveGuiServer(app, port) {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(colors.green(`GUI address: http://127.0.0.1:${port}`));
  });
}
