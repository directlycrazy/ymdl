# YMDL (YouTube-Music-Downloader)
Easily download music from YouTube.

# Usage
```js
const ymdl = require("ymdl");

ymdl.download("Artist", "Song Title", "Directory").then(() => {
	console.log("Complete!")
}).catch((error) => {
  console.error(error);
});
```

# API:
**ymdl.search(artist, name)**

Fetches the metadata of the inputted song.

```js
ymdl.search("Artist", "Song Title").then((data) => {
	console.log(data);
}).catch((error) => {
  console.error(error);
});
```

**ymdl.download(artist, name, path)**

Downloads the inputted song to a chosen directory

```js
ymdl.download("Artist", "Song Title", "Directory").then(() => {
	console.log("Complete!")
}).catch((error) => {
  console.error(error);
});
```

# Credits:
* ytdl-core
* ytsr
* axios


#### How Does It Work?
This project works by grabbing music metadata from Deezer and the song file from YouTube. Since the files are from YouTube, do not expect the files to be in original quality.

**Notice:** This project pulls audio files from YouTube, no content is stored on it whatsoever.

Copyright 2022 directlycrazy
