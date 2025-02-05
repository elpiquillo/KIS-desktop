const { app, BrowserWindow, protocol } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;
let isQuitting = false; // Flag to check if the app is quitting explicitly

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

  // Prevent window from closing via the close button but allow quitting via Dock
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      if (process.platform === 'darwin') {
        mainWindow.hide(); // Hide window on macOS
      } else {
        mainWindow.minimize(); // Minimize on Windows/Linux
      }
    }
  });
});

// Detect when the user explicitly quits the app (Cmd + Q or "Quit" from Dock)
app.on('before-quit', () => {
  isQuitting = true;
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
