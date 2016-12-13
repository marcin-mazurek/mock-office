const electronDevtoolsInstaller = require('electron-devtools-installer');

const installExtension = electronDevtoolsInstaller.default;
const REDUX_DEVTOOLS = electronDevtoolsInstaller.REDUX_DEVTOOLS;

installExtension(REDUX_DEVTOOLS);
