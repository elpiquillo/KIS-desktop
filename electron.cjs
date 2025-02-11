/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { app, BrowserWindow, protocol, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');


let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'dist', 'assets', 'AppIcon.icns'),
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
    },
    titleBarStyle: process.platform !== 'darwin' ? 'default' : 'hidden',
    trafficLightPosition: {
      x: 15,
      y: 13,
    },
  });

  const startURL = `file://${path.resolve(__dirname, 'dist', 'index.html')}`;
  mainWindow.loadURL(startURL);

  // Check for updates
  autoUpdater.checkForUpdatesAndNotify();

  // Handle window close event
  mainWindow.on('close', (event) => {
    event.preventDefault();
    if (process.platform === 'darwin') {
      mainWindow.hide();
    } else {
      mainWindow.minimize();
    }
  });

  // setupAutoUpdater();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow.isDestroyed()) {
    mainWindow = new BrowserWindow({
      icon: path.join(__dirname, 'dist', 'assets', 'AppIcon.icns'),
      width: 1280,
      height: 720,
      webPreferences: {
        nodeIntegration: true,
      },
      titleBarStyle: process.platform !== 'darwin' ? 'default' : 'hidden',
      trafficLightPosition: {
        x: 15,
        y: 13,
      },
    });
    mainWindow.loadURL(startURL);
  } else {
    mainWindow.show();
  }
});

/**
 * Function to handle updates with electron-updater
 */
function setupAutoUpdater() {
  autoUpdater.autoDownload = true; // Set to true if you want to download updates automatically

  // Listen for update availability
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new update is available. Downloading now...',
    });
  });

  // Listen for update download completion
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'A new update has been downloaded. Restart the app to apply the update?',
      buttons: ['Restart', 'Later'],
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall(); // Restart app and install update
      }
    });
  });

  // Listen for errors
  autoUpdater.on('error', (error) => {
    console.error('Update Error:', error);
    dialog.showMessageBox({
      type: 'error',
      title: 'Update Error',
      message: `Failed to update: ${error.message}`,
    });
  });

  // Periodically check for updates (every 30 minutes)
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 30 * 60 * 1000);
}
