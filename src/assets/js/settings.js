const { remote } = require('electron');

document.getElementById('btn-close').addEventListener( 'click', function() {
    window.close();
});

function save () {
	ipcRenderer.send('save-config', config);
}