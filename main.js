const path = require('path');
const electron = require('electron-prebuilt');
require('electron-reload')(path.resolve(__dirname, 'dist'), {
  electron,
  hardResetMethod: 'exit'
});

if (process.env.NODE_ENV !== 'production') {
  // for development debugging
  // eslint-disable-next-line global-require
  require('source-map-support/register');
}

require('./dist/main');
