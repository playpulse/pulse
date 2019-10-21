const ap1 = new APlayer({
    element: document.getElementById('player1'),
    mini: false,
    autoplay: false,
    lrcType: false,
    mutex: true,
    fixed: false,
    listFolded: false,
    theme: '#ff9098',
    preload: 'metadata'
});
ap1.on('play', function () {
    console.log('play');
});
ap1.on('play', function () {
    console.log('play play');
});
ap1.on('pause', function () {
    console.log('pause');
});
ap1.on('canplay', function () {
    console.log('canplay');
});
ap1.on('playing', function () {
    console.log('playing');
});
ap1.on('ended', function () {
    console.log('ended');
});
ap1.on('error', function () {
    console.log('error');
});

