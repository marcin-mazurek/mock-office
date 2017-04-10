const express = require('express');
require('./dist/double-rest-api');

const serve = express.static('./dist/double-gui');
const app = express();
const server = app.use(serve);

server.listen(3070, () => {
  console.log('GUI address: http://127.0.0.1:3070');
});
