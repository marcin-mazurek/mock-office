import { BrowserWindow, app, Menu, MenuItem } from 'electron';
import path from 'path';
import url from 'url';
import addDevTools from './devtools';
import syncRenderer from './syncRenderer';
import { restore, save } from './state';
import Double from './double';

// eslint-disable-next-line import/prefer-default-export
export const double = new Double();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1100, height: 800 });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../../index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  addDevTools();
  mainWindow.webContents.openDevTools();

  // sync UI with double
  syncRenderer(mainWindow, double.emitter);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  const menu = Menu.getApplicationMenu();
  menu.items[1].submenu.append(new MenuItem({
    label: 'Save state',
    accelerator: 'CmdOrCtrl+S',
    click() {
      save();
    }
  }));

  Menu.setApplicationMenu(menu);

  // restore saved state
  restore();
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
