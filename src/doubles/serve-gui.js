import express from 'express';
import path from 'path';

export default () => {
  const serve = express.static(path.resolve(__dirname, './gui'));
  const guiApp = express();
  const guiServer = guiApp.use(serve);

  guiServer.listen(3070, () => {
    // eslint-disable-next-line no-console
    console.log('GUI address: http://127.0.0.1:3070');
  });
};
