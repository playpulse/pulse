var config = remote.getGlobal("config");

function reloadConfig () {
	config = remote.getGlobal("config");
}

function saveConfig () {
	remote.setGlobal("config", config);
}

function applyConfig () {
	document.documentElement.style.setProperty('--theme-color-2', config.color);
	player.theme(config.color, 0);
}