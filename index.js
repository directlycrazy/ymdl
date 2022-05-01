const axios = require('axios');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');
const fs = require('fs');

let ymdl = {};

/**
 * Return information about a song
 * @param artist
 * @param name
 */
ymdl.search = (artist, name) => {
  return new Promise((res, rej) => {
    if (!artist || !artist instanceof String) return rej('Missing artist name');
    if (!name || !name instanceof String) return rej('Missing song name');

    axios.get(`https://api.deezer.com/search?limit=15&q=${artist} ${name}`).then((data) => {
      if (!data) return rej('Something went wrong fetching the data');
      if (!data.data.data.length > 0) return rej('Song not found');
      data = data.data.data[0];

      var resp = {
        title: data.title,
        preview: data.preview,
        image: `http://e-cdn-images.dzcdn.net/images/cover/${data.md5_image}/1000x1000-000000-80-0-0.jpg`,
        rank: data.rank,
        duration: data.duration,
        artist: data.artist,
        album: data.album
      };

      return res(resp);
    }).catch((e) => {
      return rej(e);
    });
  });
};

/**
 * Download a song to a requested path
 * @param artist
 * @param name
 * @param path
 */
ymdl.download = (artist, name, path) => {
  return new Promise((res, rej) => {
    if (!artist || !artist instanceof String) return rej('Missing artist name');
    if (!name || !name instanceof String) return rej('Missing song name');
    if (!path || !path instanceof String) return rej('Missing file path');

    ymdl.search(artist, name).then(async (search) => {
      const yt_results = await ytsr(search.artist.name + ' ' + search.title + ' lyrics');
      const yt_result = Object.values(yt_results.items)[0];

      const stream = await ytdl(yt_result.url, { quality: "highest", filter: "audioonly" }).on("error", error => {
        return rej(error);
      }).on("info", info => {
        const file = fs.createWriteStream(`${search.artist.name} - ${search.title}.webm`);
        stream.pipe(file);
      }).on("finish", () => {
        return res(search);
      });
    });
  });
};

module.exports = ymdl;
