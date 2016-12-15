const electron = require('electron-prebuilt');
require('./devtools');
require('electron-reload')(__dirname, {
  electron
});
require('./dist/main');
