const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL('http://localhost:5173/');
});
