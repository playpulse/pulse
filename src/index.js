// Libraries
const { app, BrowserWindow, BrowserView, globalShortcut, Menu, ipcMain, systemPreferences } = require( 'electron' );
const remote = require('electron').remote;
const electronStore = require('electron-store');
const path = require('path');

// Singleton
const store = new electronStore();

// Objects
let mainWindow;
let view;

// Global variables
const musicPath = app.getPath("music");
const dlPath = app.getPath("downloads");
global.musicPath = musicPath;
global.dlPath = dlPath;
global.store = store;

const webUrl = path.join(__dirname, 'views/player.html');
const windowSize = { width: 1280, height: 768 };
const title = "Pulse";

if (store.get('first-run') == null) {
	store.set('first-run', false);
	store.set('theme', 'default');
}

// App events
app.on('ready', function() {
	mainWindow = new BrowserWindow({
        width: windowSize.width,
        height: windowSize.height,
        minWidth: 800,
        minHeight: 600,
	    icon: path.join(__dirname, 'assets/icon.png'),
	    modal: true, 
        frame: false, 
        center: true, 
        resizable: true, 
        title: title,
      transparent: true,
	    webPreferences: {
	      	nodeIntegration: true
	    }
  	});

  	view = new BrowserView( {
        backgroundColor: '#23232355',
        webPreferences: {
            nodeIntegration: true
        }
    } );

  	mainWindow.setBrowserView( view );
  	view.setBounds( { x: 1, y: 29, width: windowSize.width - 2, height: windowSize.height - 30 } );

  	mainWindow.loadFile(path.join(__dirname, 'views/titlebar.html'));
  	view.webContents.loadFile(webUrl);

    // view.webContents.openDevTools();

  	// Main Window Events
  	mainWindow.on( 'closed', function () {
        mainWindow = null;
    });

    mainWindow.on( 'resize', function() {
        const windowSize = mainWindow.getSize();

        if ( mainWindow.isMaximized() ) {
            view.setBounds( { x: 1, y: 29, width: windowSize[0]-17, height: windowSize[1]-45 } );
        } else {
            view.setBounds( { x: 1, y: 29, width: windowSize[0]-2, height: windowSize[1]-30 } );
        }
    } );


    // View Events
    view.webContents.on( 'did-navigate-in-page', function() {

    } );
});

app.on('window-all-closed', function () {
 	app.quit();
});

// IPC Events
ipcMain.on('app-close', function() {
    app.quit();
});

ipcMain.on('app-reload', function() {
  mainWindow.webContents.reload();
	view.webContents.reload();
});

ipcMain.on('view-home', function() {
	view.webContents.loadURL( webUrl );
});

ipcMain.on('view-back', function() {
	view.webContents.executeJavaScript('history.go(-1);');
});

ipcMain.on('view-next', function() {
	view.webContents.executeJavaScript('history.go(1);');
});

ipcMain.on('open-settings', function() {
  const settings = new BrowserWindow({ 
    parent: mainWindow, 
    modal: true, 
    frame: false, 
    center: true, 
    resizable: true, 
    backgroundColor: '#232323', 
    width: 800, 
    icon: path.join( __dirname, 'assets/icon.png' ), 
    webPreferences: {
      nodeIntegration: true
    }
  });

  settings.loadFile( path.join( __dirname, 'views/settings.html' ) );
});

ipcMain.on('set-setting', function(variable, value) {
  view.webContents.executeJavaScript(`setSetting('${variable}', ${value})`);
});