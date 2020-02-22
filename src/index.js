// Libraries
const { app, BrowserWindow, BrowserView, globalShortcut, Menu, ipcMain, systemPreferences } = require( 'electron' );
const remote = require('electron').remote;
const path = require('path');

// Objects
let mainWindow;
let view;

// Global variables
const musicPath = app.getPath("music");
const dlPath = app.getPath("downloads");
global.musicPath = musicPath;
global.dlPath = dlPath;

// Some utils variables
const webUrl = path.join(__dirname, 'views/player.html');
const windowSize = { width: 1280, height: 768 };
const title = "Pulse";

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
	    backgroundColor: '#111',
	    webPreferences: {
	      	nodeIntegration: true
	    }
  	});

  	view = new BrowserView( {
        webPreferences: {
            nodeIntegration: true
        }
    } );

  	mainWindow.setBrowserView( view );
  	view.setBounds( { x: 1, y: 29, width: windowSize.width - 2, height: windowSize.height - 30 } );

  	mainWindow.loadFile(path.join(__dirname, 'views/titlebar.html'));
  	view.webContents.loadFile(webUrl);

    view.webContents.openDevTools();

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
});

app.on('window-all-closed', function () {
 	app.quit();
});

// IPC Events
ipcMain.on('app-close', function() {
    app.exit();
});

ipcMain.on('view-reload', function() {
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