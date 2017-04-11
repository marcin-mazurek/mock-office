const path = require('path');

const electronExecutablePath = path.resolve(__dirname, '../node_modules/.bin/electron');

require('electron-reload')(path.resolve(__dirname), {
  electron: electronExecutablePath,
  hardResetMethod: 'exit'
});

if (process.env.NODE_ENV !== 'production') {
  // for development debugging
  // eslint-disable-next-line global-require
  require('source-map-support/register');
}

require('./main');
