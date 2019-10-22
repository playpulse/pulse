const { app, BrowserWindow, BrowserView, globalShortcut, Menu, ipcMain, systemPreferences } = require( 'electron' );

const path = require('path');
const fs = require('fs');
const DiscordRPC = require('discord-rpc');

const clientId = '600512479398985768';
DiscordRPC.register(clientId);

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

ipcMain.on('tray', function (data, title, text) {
	tray.balloon(title, text);
});

ipcMain.on('rpcupdate', function (data, song, author) {
	console.log(song + " " + author)
	rpcupdate(song, author);
});

ipcMain.on("switchstatus", function (data, status) {
	console.log(status);
	switchStatus(status)
});

const rpc = new DiscordRPC.Client({ transport: 'ipc' });


async function setActivity() {
  if (!rpc || !win) {
    return;
  }

  rpc.setActivity({
    details: `Idle`,    
    largeImageKey: 'applogo',
    instance: false
  });
}

var timestamp;
var currentSong;
var currentArtist;

var covers = ["andone"];

function rpcupdate (song, artist) {
    timestamp = new Date();
    currentSong = song;
    currentArtist = artist;

    var logo = "applogo"

    if (covers.includes(artist.toLowerCase().replace(/ /g, "")))
    	logo = artist.toLowerCase().replace(/ /g, "");

    rpc.setActivity({
    	details: song,
    	state: artist,
    	startTimestamp: timestamp,
    	largeImageKey: logo,
    	instance: false
  	});
}

global.rpcupdate = rpcupdate;

function switchStatus (status) {
	var logo = "applogo"

    if (covers.includes(currentArtist.toLowerCase().replace(/ /g, "")))
    	logo = currentArtist.toLowerCase().replace(/ /g, "");

    rpc.setActivity({
    details: currentSong,
    state: currentArtist,
    startTimestamp: timestamp,
    largeImageKey: logo,
    smallImageKey: status,
    smallImageText: status.replace("_", "").replace("song", ""),
    instance: false
  });
}

rpc.on('ready', () => {
  setActivity();
});

rpc.login({ clientId }).catch(console.error);

const tray = require( './tray' );