import { BrowserWindow, app } from 'electron';
import path from 'path';
import url from 'url';
import EventEmitter from 'events';
import {
  EXPECTATION_ADD,
  EXPECTATION_LOAD,
  EXPECTATION_UNLOAD,
  SERVER_START,
  SERVER_STOP,
  ADD_SERVER,
  EXPECTATION_UNLOAD_AFTER_USE
} from '../common/messageNames';
import expectationsEvents from './listeners/expectationsEvents';
import serverEvents from './listeners/serversEvents';
import servers from './servers';
import expectations from './expectations';
import Expectation from './expectations/httpExpectation/Expectation';

const myEE = new EventEmitter();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

/* eslint-disable no-console */
serverEvents.on('start', (id) => {
  const serverToStart = servers.get(id);

  if (!serverToStart.isLive()) {
    serverToStart.start(() => {
      mainWindow.webContents.send(SERVER_START);
      console.log('Mockee server is running!');
    });
  }
});

serverEvents.on('stop', (id) => {
  const serverToStop = servers.get(id);

  if (serverToStop.isLive()) {
    serverToStop.stop(() => {
      mainWindow.webContents.send(SERVER_STOP);
      console.log('Mockee server is shut down!');
    });
  }
});

serverEvents.on('add', (args) => {
  const { name, port } = args;
  const serverId = servers.add('http', { name, port, ee: myEE });
  mainWindow.webContents.send(ADD_SERVER, { name, port, id: serverId });
});

expectationsEvents.on('load', (args) => {
  const id = servers.get(args.serverId).load(args.expectationId, args.quantity, args.infinite);
  mainWindow.webContents.send(EXPECTATION_LOAD, { id });
});

expectationsEvents.on('unload', (args) => {
  servers.get(args.serverId).unload(args.expectationId);
  mainWindow.webContents.send(EXPECTATION_UNLOAD);
});

myEE.on(EXPECTATION_UNLOAD_AFTER_USE, ({ serverId, expectationId }) => {
  mainWindow.webContents.send(EXPECTATION_UNLOAD_AFTER_USE, { serverId, expectationId });
});

expectationsEvents.on('add', (args) => {
  const serverToAddMock = servers.get(args.serverId);
  const exps = args.expectations.map(exp => new Expectation(exp));
  const expectationsIds = exps.map(exp => expectations.add('http', exp));
  serverToAddMock.add(expectationsIds);
  mainWindow.webContents.send(EXPECTATION_ADD, exps.map((exp, index) =>
    Object.assign({}, exp, { id: expectationsIds[index] })
  ));
});

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1000, height: 700 });

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
