const path = require('path');
const { app, BrowserWindow } = require('electron');
const { updateElectronApp } = require('update-electron-app');

let mainWindow;
let isQuitting = false;
// Setup auto-updates
updateElectronApp({
  updateSource: {
    provider: 'github',
    repo: 'KIS-desktop',
    owner: 'elpiquillo',
  }
});

const createMainWindow = () => {
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

  // Handle window close event
  mainWindow.on('close', (event) => {
    if (process.platform === 'darwin' && !isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
};

app.whenReady().then(createMainWindow);

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show(); // Réaffiche la fenêtre si elle est cachée
  } else {
    createMainWindow();
  }
});

/**
 * Function to handle updates with electron-updater
 */
// function setupAutoUpdater() {
//   autoUpdater.autoDownload = true; // Set to true if you want to download updates automatically

//   // Listen for update availability
//   autoUpdater.on('update-available', () => {
//     dialog.showMessageBox({
//       type: 'info',
//       title: 'Update Available',
//       message: 'A new update is available. Downloading now...',
//     });
//   });

//   // Listen for update download completion
//   autoUpdater.on('update-downloaded', () => {
//     dialog.showMessageBox({
//       type: 'info',
//       title: 'Update Ready',
//       message: 'A new update has been downloaded. Restart the app to apply the update?',
//       buttons: ['Restart', 'Later'],
//     }).then((result) => {
//       if (result.response === 0) {
//         autoUpdater.quitAndInstall(); // Restart app and install update
//       }
//     });
//   });

//   // Listen for errors
//   autoUpdater.on('error', (error) => {
//     console.error('Update Error:', error);
//     dialog.showMessageBox({
//       type: 'error',
//       title: 'Update Error',
//       message: `Failed to update: ${error.message}`,
//     });
//   });

//   // Periodically check for updates (every 30 minutes)
//   setInterval(() => {
//     autoUpdater.checkForUpdates();
//   }, 30 * 60 * 1000);
// }
