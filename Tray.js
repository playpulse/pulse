const { app, Menu, Tray, BrowserWindow } = require( 'electron' );
const nativeImage = require( 'electron' ).nativeImage;

let tray = null;
let saved_icon = null;
let saved_mainWindow = null;

let init_tray = () => {
  const contextMenu = Menu.buildFromTemplate(
      [
          { label: 'Pulse | Build 1.2.0 Alpha', type: 'normal', click:
              function() { saved_mainWindow.show(); } },

          { type: 'separator' },

          { label: 'Play', type: 'normal', click:
			function() { mediaController('play'); } },

		  { label: 'Pause', type: 'normal', click:
			function() { mediaController('pause'); } },

          { type: 'separator' },

          { label: 'Exit', type: 'normal', click:
              function() { app.exit(); }
          }
      ]
  );

  tray.setToolTip( 'PlayPulse Desktop Application' );
  tray.setContextMenu( contextMenu );

  tray.addListener( 'click', function() {
      saved_mainWindow.isVisible() ? saved_mainWindow.hide() : saved_mainWindow.show();
  } );

  tray.addListener( 'balloon-click', function() {
      saved_mainWindow.isVisible() ? saved_mainWindow.focus() : saved_mainWindow.show();
  } );
}

let popUpMenu = null;

exports.createTray = function( mainWindow, icon ) {
    saved_icon = icon;
    const nativeImageIcon = nativeImage.createFromPath( saved_icon );
    tray = new Tray( nativeImageIcon );
  
    saved_mainWindow = mainWindow;

    tray.setHighlightMode('never')
    init_tray();
};

exports.balloon = function( title, content ) {
    tray.displayBalloon( {
        icon: 'assets/icon.png',
        title: title,
        content: content        
    });
};

exports.quit = function() {
    tray.quit();
};

function mediaController (action) {

}
