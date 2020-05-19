const { YouTube } = require('yutub');
const YMD = require("youtube-mp3-downloader");
const ffmpegPath = path.join(__dirname, '..', '..', 'node_modules', 'ffmpeg-binaries', 'bin', 'ffmpeg.exe');
console.log('Setting ffmpeg path to: ' + ffmpegPath);

var yd = new YMD ({
	"ffmpegPath": ffmpegPath,
    "outputPath": remote.getGlobal('dlPath'),
    "youtubeVideoQuality": "highest",
    "queueParallelism": 2,
    "progressTimeout": 2000
});
const youtube = new YouTube();

const ytdList = [];

async function search (words) {
	return new Promise((resolve, reject) => {
		youtube.searchVideos(words, 10).then(videos => {
			resolve(videos);
		}).catch((e) => {
			console.error(e);
			reject(e);
		})
	});
}

async function test (keywords) {
	console.log("Searching for: " + keywords)
	const videos = await search(keywords).catch((e) => { return null });
	if (videos == null) return;

	const result = videos[0];

	if (result == null) return console.log("Error searching video: " + keywords);
	console.log("Starting download");

	download(result.id)
}

async function searchYT () {
	const domlist = document.getElementById("yt-result-list");
	domlist.innerHTML = "Searching...";

	var params = document.getElementById("youtube-search-input").value;
	var error = null;
	const list = await search(params).catch((e) => { error = e; return null });

	if (list == null) return domlist.innerHTML = "Error trying to search words: " + params + "<br/> " + error;

	if (list[0] == null) return domlist.innerHTML = "No result founded for: " + params;

	domlist.innerHTML = "";
	for (let song of list) {
		domlist.innerHTML = domlist.innerHTML + getButtonForYTD(song.id, song.channel.name, song.title, song.thumbnail_url);
	}
}

function getButtonForYTD (id, author, name, thumb) {
	return `
    <div class="col-xs-12 song-btn" onclick="downloadYTVideo('${id}')">
        <div class="item r" data-id="item-5" data-src="">
            <div class="item-media" id="yt-result-image-${id}">
                <a class="item-media-content" style="background-image: url('${thumb}');"></a>
            </div>
            <div class="item-info">
                <div class="item-title text-ellipsis">
                    <a onclick="downloadYTVideo('${id}')">${name}</a>
                </div>
                <div class="item-author text-sm text-ellipsis ">
                    <a onclick="downloadYTVideo('${id}')">${author}</a>
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
    `;
}

function downloadYTVideo(id) {
	if (ytdList.includes(id)) return;

	ytdList.push(id);	
	download(id);
	document.getElementById("yt-result-image-" + id).innerHTML = `<a class="item-media-content" style="background-image: url('https://www.ngahr.com/wp-content/uploads/2018/11/ajax-spinner.gif');"></a>`;
}

function download (url) {
	yd.download(url)
}

yd.on("finished", function(err, data) {
	document.innerHTML = JSON.stringify(data);
	document.getElementById("yt-result-image-" + data.id).innerHTML = `<a class="item-media-content" style="background-image: url('https://image.flaticon.com/icons/svg/2039/2039031.svg');"></a>`;
	console.log("Downloaded succefully");
    console.log(JSON.stringify(data));
});