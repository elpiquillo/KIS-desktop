const { app, BrowserWindow, protocol } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
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

  const startURL = `file://${path.join(__dirname, 'dist', 'index.html')}`;
  mainWindow.loadURL(startURL);

  // Prevent window from closing, minimize instead (Windows/Linux) or hide (macOS)
  mainWindow.on('close', (event) => {
    event.preventDefault(); // Prevent the window from closing
    if (process.platform === 'darwin') {
      mainWindow.hide(); // Hide the window on macOS
    } else {
      mainWindow.minimize(); // Minimize the window on Windows/Linux
    }
  });
});

// Ensure the app quits fully when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Reopen the window if the user clicks on the app icon (macOS behavior)
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
