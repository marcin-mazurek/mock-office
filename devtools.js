const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.on('ready', () => {
  // React devtools
  BrowserWindow.addDevToolsExtension('/Users/bartoszadamczyk/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/0.15.4_0');
  // Redux devtools
  BrowserWindow.addDevToolsExtension('/Users/bartoszadamczyk/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.11.1.1_0');
});
