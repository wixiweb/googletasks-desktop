// Include Node.JS Electron modules
const electron = require('electron');
// Include Node.JS Path module
const path = require("path");

// Electron module to control application life.
const app = electron.app;
// Electron module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Electron module to create tray icon on notification bar
const Tray = electron.Tray;
// Electron module to create tray menu or context menu
const Menu = electron.Menu;
// Electron module to allow communication between main en renderer process
const ipc = electron.ipcMain;
// Electron module to use shell like open external link
const shell = electron.shell;


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let appIcon;

function createWindow() {

    var display = electron.screen;

    // Create the browser window.
    mainWindow = new BrowserWindow({
        'width': 400,
        'height': 600,
        'x': display.getPrimaryDisplay().workAreaSize.width - 400,
        'y': display.getPrimaryDisplay().workAreaSize.height - 600,
        'icon': path.join(__dirname, 'images', 'appicon.png'),
        'minWidth': 300,
        'minHeight': 300,
        'backgroundColor': '#50ffffff',
        'frame': false,       // Hide system menu
        'transparent': true,  // No app Background
        'skipTaskbar': true,  // Hidden on taskbar
    });

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/views/index.html`);

    appIcon = new Tray(path.join(__dirname, 'images', 'trayicon.png'));
    appIcon.setToolTip('GoogleTasks Desktop by Wixiweb');
    appIcon.on('click', function () {
        if(mainWindow.isVisible()){
            mainWindow.hide();
        }else{
            mainWindow.focus();
            mainWindow.show();
        }
    });

    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Debug',
            icon: path.join(__dirname, 'images', 'debug.png'),
            click: function () {

                // Open the DevTools.
                mainWindow.openDevTools();

                // Adapte app size for DevTools.
                mainWindow.setSize(
                    mainWindow.getSize()[0] + 600,
                    mainWindow.getSize()[1]
                );

                // Adapte app position for DevTools.
                mainWindow.setPosition(
                    mainWindow.getPosition()[0] - 600,
                    mainWindow.getPosition()[1]
                );
            }
        }, {
            label: 'Open in browser',
            icon: path.join(__dirname, 'images', 'external.png'),
            click: function () {
                shell.openExternal("https://mail.google.com/tasks/ig")
            }
        }, {
            label: 'Logout',
            icon: path.join(__dirname, 'images', 'logout.png'),
            click: function () {
                mainWindow.webContents.send('view-load-url', 'https://accounts.google.com/logout?&continue=https%3A%2F%2Fmail.google.com%2Ftasks%2Fig&followup=https%3A%2F%2Fmail.google.com%2Ftasks%2Fig#identifier');
            }
        }, {
            label: 'Close',
            icon: path.join(__dirname, 'images', 'close.png'),
            click: function () {
                mainWindow.close();
            }
        }

    ]);

    // Apply contextMenu to the Tray Icon
    appIcon.setContextMenu(contextMenu);

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
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

ipc.on('close-main-window', function () {
    if (mainWindow) {
        mainWindow.hide();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
