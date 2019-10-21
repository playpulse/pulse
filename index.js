const { app, BrowserWindow, BrowserView, globalShortcut, Menu, ipcMain, systemPreferences } = require( 'electron' );

const path = require('path');
const fs = require('fs');

const directoryPath = app.getPath("music");
global.musicPath = directoryPath;

let win;

function createWindow () {
	win =  new BrowserWindow({
		width: 1180,
		height: 720,
		frame: false,
        center: true,
        autoHideMenuBar: true,
        backgroundColor: '#0b121e',
		//frame: false,
		webPreferences: {
			nodeIntegration: true
		}
	});

	win.loadFile('main.html');

	win.on('closed', () => {
		win = null;
	});
}

const config = {
	appIcon : "assets/icon.png"
}

app.on('ready', () => {
	createWindow();
	tray.createTray( win, config.appIcon );
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin')
		app.quit();
});

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});

ipcMain.on( 'will-close-mainwindow', function() {
    app.quit();
} )

ipcMain.on('tray-test', function () {
	tray.balloon("Pulse", "Lorem ipsum");
});

const tray = require( './tray' );