const { remote, ipcRenderer: ipc } = require( 'electron' );
const path = require('path');
const fs = require('fs');

fs.readdir(remote.getGlobal("musicPath"), function (err, files) {

if (err) {
    return console.log('Unable to scan directory: ' + err);
} 

files.forEach(function (file) {
    if (path.extname(file) == ".mp3" || path.extname(file) == ".wav")
        insertMusic(file.replace(path.extname(file), ""), path.join(remote.getGlobal("musicPath"), file));
    });
});

function insertMusic (name, url) {
    var obj = document.getElementById("musicList");
    obj.innerHTML = obj.innerHTML + getMusicObject(name, url);
}

function getMusicObject (name, url) {
	var song = name.split(" - ")[1];
	var author = name.split(" - ")[0];

	if (song == null || song == undefined)  {
		song = name;
		author = "Unknown";
	}

	var thumb = url.replace(".mp3", ".jpg").replace(".wav", ".jpg").replace(name, author);

	return `
		<div class="col-xs-3 song" onclick="${getPlayFunction(name, url)}">
			<div class="song-album"  style="background-color: ${getRandomRgb()}; background: '${thumb}'";><img src="assets/play.png"> </div>
			<div class="song-details">
				<a class="song-title">${song} <span class="song-author">${author}</span></a> 
			</div>
		</div> 
		<br/>
	`;
}

function getPlayFunction (file, url) {
	url = url.replace(/\\/g, "/");

	var song = file.split(" - ")[1];
	var author = file.split(" - ")[0];

	if (song == null || song == undefined)  {
		song = file;
		author = "Unknown";
	}

	return `rpcupdate('${song}', '${author}'); ap1.pause(); ap1.list.clear(); ap1.list.add([{
      name: '${song}',
      artist: '${author}',
      url: '${url}',
      cover: '',
      lrc: 'lrc.lrc'}]); ap1.play()`;
}

function getRandomRgb() {
  var num = Math.round(0xffffff * Math.random());
  var r = num >> 16;
  var g = num >> 8 & 255;
  var b = num & 255;
  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

function rpcupdate (song, author) {
	ipc.send("rpcupdate", song, author);
	trayTest("Now playing", song + " - " + author);
}

function switchStatus (status) {
	ipc.send("switchstatus", status);
}

ap1.on('play', function () {
    switchStatus ('playing_song');
    setCurrentTheme();
});

ap1.on('pause', function () {
    switchStatus ('song_paused')
});