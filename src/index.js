const path = require('path');
const electronPrebuilt = require('electron-prebuilt');
require('electron-reload')(path.resolve(__dirname), {
  electron: electronPrebuilt,
  hardResetMethod: 'exit'
});

if (process.env.NODE_ENV !== 'production') {
  // for development debugging
  // eslint-disable-next-line global-require
  require('source-map-support/register');
}

require('./main');
