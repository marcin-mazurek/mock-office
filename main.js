const path = require('path');
const electron = require('electron-prebuilt');
require('./devtools');
require('electron-reload')(path.resolve(__dirname, 'dist'), {
  electron
});
require('./dist/main');
