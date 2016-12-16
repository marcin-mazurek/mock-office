import { ipcMain, BrowserWindow, app } from 'electron';
import path from 'path';
import url from 'url';
import uniqueId from 'node-unique';
import {
  EXPECTATION_ADD,
  SERVER_START,
  SERVER_STOP,
  SERVER_ADD
} from '../common/messageNames';
import expectationsEvents from './listeners/expectationsEvents';
import servers from './servers';

const id = servers.add('my-server', 'rest');
const server = servers.get(id);
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

/* eslint-disable no-console */
ipcMain.on(SERVER_START, () => {
  if (!server.isLive()) {
    server.start(() => {
      console.log('Mockee server is running!');
    });
  }
});

ipcMain.on(SERVER_STOP, () => {
  if (server.isLive()) {
    server.stop(() => {
      console.log('Mockee server is shut down!');
    });
  }
});

ipcMain.on(SERVER_ADD, (e, args) => {
  const { name, port } = args;
  const serverId = servers.add(name, 'rest');
  mainWindow.webContents.send(SERVER_ADD, { name, port, id: serverId });
});

const Mock = (data) => {
  const mock = data;
  mock.id = uniqueId();
  return mock;
};

expectationsEvents.on('load', server.load);
expectationsEvents.on('unload', server.unload);
expectationsEvents.on('add', (mocks) => {
  const mocksWithIds = mocks.map(mock => new Mock(mock));
  server.add(mocksWithIds);
  mainWindow.webContents.send(EXPECTATION_ADD, mocksWithIds);
});

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../../index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
