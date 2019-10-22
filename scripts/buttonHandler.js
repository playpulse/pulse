const win = remote.getCurrentWindow();

document.getElementById( 'btn-minimize' ).addEventListener( 'click', function() {
    win.minimize();
});
    
document.getElementById( 'btn-maximize' ).addEventListener( 'click', function() {
    if ( !win.isMaximized() ) {
        win.maximize();
    } else {
        win.unmaximize();
    }
} );
    
document.getElementById( 'btn-close' ).addEventListener( 'click', function() {
    ipc.send( 'will-close-mainwindow' )
} );

function trayTest (title, text) {
	ipc.send('tray', title, text);
}