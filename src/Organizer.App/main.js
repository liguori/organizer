const { app, BrowserWindow, net } = require('electron')
const path = require('path')
const url = require('url')
const { setupTitlebar, attachTitlebarToWindow } = require('custom-electron-titlebar/main')

// Setup the titlebar main process
setupTitlebar()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    icon: path.join(__dirname, 'engament.ico'),
    transparent: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'UI/browser/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  })

  // Attach titlebar listeners for fullscreen and focus
  attachTitlebarToWindow(mainWindow);

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', initialize)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    initialize()
  }
})


var apiProcess = null;

function waitForApi(apiUrl, retries, delay) {
  return new Promise((resolve) => {
    function check(attempt) {
      if (attempt >= retries) {
        writeLog('API readiness check: max retries reached, proceeding anyway');
        resolve();
        return;
      }
      const request = net.request(apiUrl);
      request.on('response', () => {
        writeLog('API is ready');
        resolve();
      });
      request.on('error', () => {
        writeLog(`API not ready yet (attempt ${attempt + 1}/${retries}), retrying in ${delay}ms...`);
        setTimeout(() => check(attempt + 1), delay);
      });
      request.end();
    }
    check(0);
  });
}

function initialize() {
  var proc = require('child_process').spawn;
  //  run server
  var apipath = path.join(__dirname, 'Services/Organizer.API.dll');

  apiProcess = proc('dotnet', [apipath], { cwd: path.dirname(apipath) });

  apiProcess.stdout.on('data', (data) => {
    writeLog(`stdout: ${data}`);
  });

  // Wait for the API to be ready before creating the window
  waitForApi('http://localhost:5541/api/Appointments/calendars', 30, 1000).then(() => {
    if (mainWindow == null) {
      createWindow();
    }
  });
}

//Kill process when electron exits
process.on('exit', function () {
  writeLog('exit');
  apiProcess.kill();
});

function writeLog(msg) {
  console.log(msg);
}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.