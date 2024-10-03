const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');

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
  mainWindow.loadURL('http://localhost:8081/');
});
