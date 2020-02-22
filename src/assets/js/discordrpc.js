const DiscordRPC = require('discord-rpc');

const clientId = '600512479398985768';
DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

var timestamp;
var currentState;

var artists = ["rammstein", "skrillex", "andone", "nightcore", "linkinpark", "martingarrix", "alanwalker", "elrubiusomg"];

function switchState (state) {
  currentState = state;
}

function initPresence () {
  rpc.setActivity({
    details: `Idle`,    
    largeImageText: "Coded by @Sammwy_",
    largeImageKey: 'applogo',
    instance: false
  });
}

function getIcon () {
  const artist = currentSong.author.toLowerCase().replace(" ", "").replace(" ", "").replace(" ", "");
  if (artists.includes(artist))
    return artist;
  else
    return "applogo"
}

function rpcupdate () {
    timestamp = new Date();
    rpc.setActivity({
      details: currentSong.name,
      state: currentSong.author,
      startTimestamp: timestamp,
      largeImageText: "Coded by @Sammwy_",
      largeImageKey: getIcon(),
      instance: false
    });
}

function switchStatus (status) {
  rpc.setActivity({
    details: currentSong.name,
    state: currentSong.author,
    startTimestamp: timestamp,
    largeImageKey: getIcon(currentSong.author),
    largeImageText: "Coded by Sammwy",
    smallImageKey: status,
    smallImageText: status.replace("_", "").replace("song", ""),
    instance: false
  });
}

rpc.on('ready', () => {
  initPresence();
});

rpc.login({ clientId }).catch(console.error);