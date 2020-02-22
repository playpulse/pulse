/* Import some libraries */
const { remote } = require('electron');
const path = require('path');
const fs = require('fs');

/* Some utils variables and objects */
const songList = [];
const currentSong = {name: "unknown", author: "unknown", url: ""}

/* Scan for music file */
function scanFolder (folderpath) {
    const htmlObject = document.getElementById("musicList");
    htmlObject.innerHTML = '<h3 class="explorer-warn">Scannig for music files in this directory...</h3>';

    fs.readdir(folderpath, function (err, files) {
        if (err) { 
            htmlObject.innerHTML = `<div class="explorer-warn"><h3>Unable to scan directory :(</h3> <p class="text-muted">${err}</p></div>`;
            return console.log('Unable to scan directory: ' + err);
        }

        htmlObject.innerHTML = "";

        let dirEmpty = true;

        files.forEach(function (file) {
            const url = path.join(folderpath, file).replace(/\\/g, "/");
            if (path.extname(file) == ".mp3" || path.extname(file) == ".wav") {
                dirEmpty = false;
                addSong(url);
                if (!songList.includes(url))
                    songList.push(url);
            }
        });

        if (dirEmpty)
            htmlObject.innerHTML = '<h3 class="explorer-warn">Directory is empty :(</h3>';
    });
}

function scanForDirectories () {
    let folderpath = remote.getGlobal("musicPath");
    fs.readdir(folderpath, function (err, files) {
        files.forEach(function (file) {
            const url = path.join(folderpath, file).replace(/\\/g, "/");
            fs.stat(url, function(err, stat) {
                if (stat.isDirectory()) { 
                    addSubdirectory(url, file); 
                } 
            });
        });
    });
}

/* Sub directories */
function addSubdirectory (url, file) {
    let htmlobj = document.getElementById("path-list");
    let newobj = `<button class="folder" onclick="switchToDirectory('${url}', this)">${file}</button>`;
    htmlobj.innerHTML = htmlobj.innerHTML + newobj;
}

/* Create player */
const player = new APlayer({
    element: document.getElementById('player'),
    mini: false,
    autoplay: false,
    lrcType: false,
    mutex: true,
    fixed: false,
    listFolded: false,
    repeat: false,
    theme: '#ff9098',
    preload: 'metadata'
});

/* Some functions */
function play (url) {
    const file = url.split("/")[url.split("/").length - 1];

    let author = file.split(" - ")[1];
    let song = file.split(" - ")[0];

    if (author == null) {
        song = file.replace(path.extname(file), "");;
        author = "Unknown";
    } else {
        author = author.replace(path.extname(author), "");
    }

    const songCover = url.replace(file, author + ".jpg")

    player.pause();
    player.list.clear();

    player.list.add([{
        name: song,
        artist: author,
        url: url,
        cover: songCover,
        lrc: 'lrc.lrc'
    }]);

    player.play();

    currentSong.name = song;
    currentSong.author = author;
    currentSong.url = url;
}

function addSong (url) {
    const htmlObject = document.getElementById("musicList");
    htmlObject.innerHTML = htmlObject.innerHTML + getMusicObject(url);
}

function getMusicObject (url) {
    let songFile = url.split("/")[url.split("/").length - 1];
    songFile = songFile.replace(path.extname(songFile), "");

    let songAuthor = songFile.split(" - ")[1];
    let songName = songFile.split(" - ")[0];

    if (songAuthor == null) {
        songName = songFile;
        songAuthor = "Unknown";
    }

    const songCover = url.replace(songFile + ".mp3", songAuthor + ".jpg");

    const button = `
    <div class="col-xs-12 song-btn" onclick="play('${url}')">
        <div class="item r" data-id="item-5" data-src="">
            <div class="item-media ">
                <a class="item-media-content" style="background-image: url('${songCover}');"></a>
            </div>
            <div class="item-info">
                <div class="item-title text-ellipsis">
                    <a onclick="play('${url}')">${songName}</a>
                </div>
                <div class="item-author text-sm text-ellipsis ">
                    <a onclick="play('${url}')">${songAuthor}</a>
                </div>
                <div class="item-meta text-sm text-muted">
                    <span class="item-meta-stats text-xs  item-meta-right">
                        <i class="fa fa-play text-muted"></i> 
                        <i class="fa fa-heart m-l-sm text-muted"></i> 
                    </span>
                </div>           
            </div>
        </div>
    </div>
    `
    return button;
}

function getIdByUrl (url) {
    for (let i = 0; i < songList.length; i++) {
        if (songList[i] == url)
            return i;
    }
}

function getUrlById (id)  {
    return songList[id];
}

/* Events */
player.on('play', function () {
    rpcupdate ()
});

player.on('pause', function () {
    switchStatus("song_paused");
});

player.on('canplay', function () {

});

player.on('playing', function () {
    switchStatus ('playing_song');
});

player.on('ended', function () {
    console.log('ended');
    const endedId = getIdByUrl(currentSong.url);
    const nextUrl = getUrlById(endedId + 1);

    if (nextUrl != null && !player.options.repeat)
        play(nextUrl);
});

player.on('error', function () {
    console.log('error');
});

/* Start */
scanFolder(remote.getGlobal("musicPath"));
scanForDirectories();
player.template.loop.click();