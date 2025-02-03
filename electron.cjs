const { app, BrowserWindow, protocol } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {

  autoUpdater.checkForUpdatesAndNotify();
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
    },
    titleBarStyle: process.platform !== 'darwin' ? 'default' : 'hidden',
    trafficLightPosition: {
      x: 15,
      y: 13,  // macOS traffic lights seem to be 14px in diameter. If you want them vertically centered, set this to `titlebar_height / 2 - 7`.
    },
  });
  const startURL = `file://${path.join(__dirname, 'dist', 'index.html')}`;

  mainWindow.loadURL(startURL);  
});
