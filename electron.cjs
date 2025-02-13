const path = require('path');
const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const { updateElectronApp, UpdateSourceType } = require('update-electron-app');

let mainWindow;
let isQuitting = false;
// Setup auto-updates
updateElectronApp({
  updateSource: {
    type: UpdateSourceType.ElectronPublicUpdateService,
    repo: 'https://github.com/elpiquillo/KIS-desktop',
  },
  updateInterval: '1 hour',
  // eslint-disable-next-line global-require
  logger: require('electron-log'),
});

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'dist', 'assets', 'AppIcon.icns'),
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      enableRemoteModule: true
    },
    titleBarStyle: process.platform !== 'darwin' ? 'default' : 'hidden',
    trafficLightPosition: {
      x: 15,
      y: 13,
    },
  });
  const startURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8081'
      : `file://${path.resolve(__dirname, 'dist', 'index.html')}`;
  // const startURL = `file://${path.resolve(__dirname, 'dist', 'index.html')}`;
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
    mainWindow.show();
  } else {
    createMainWindow();
  }
});

ipcMain.on('show-notification', (_, { title, body }) => {
  new Notification({ title, body }).show();
});
