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
 * Return information about a song using Deezer id
 * @param artist
 * @param name
 */
ymdl.search_from_id = (id) => {
  return new Promise((res, rej) => {
    if (!id) return rej('Missing Deezer ID');

    axios.get(`https://api.deezer.com/track/${id}`).then((data) => {
      if (!data) return rej('Something went wrong fetching the data');
      if (!data.data) return rej('Song not found');
      data = data.data;

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
      console.log(e);
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

/**
 * Download a song to a requested path
 * @param artist
 * @param name
 * @param path
 */
ymdl.download_from_id = (id, path) => {
  return new Promise((res, rej) => {
    if (!id) return rej('Missing Deezer ID');
    if (!path) return rej('Missing path');

    ymdl.search_from_id(id).then(async (search) => {
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

/**
 * Pipe an audio stream
 * @param artist
 * @param name
 * @param path
 */
ymdl.pipe = (artist, name, pipe) => {
  if (!artist || !artist instanceof String) return rej('Missing artist name');
  if (!name || !name instanceof String) return rej('Missing song name');
  if (!pipe) return rej('Missing pipe');

  ymdl.search(artist, name).then(async (search) => {
    const yt_results = await ytsr(search.artist.name + ' ' + search.title + ' lyrics');
    const yt_result = Object.values(yt_results.items)[1];

    const stream = await ytdl(yt_result.url, { quality: "highest", filter: "audioonly" }).on("error", error => {
      console.error(error);
    }).on("info", info => {
      stream.pipe(pipe);
    }).on("finish", () => {
      return;
    });
  });
};

/**
 * Pipe an audio stream using a Deezer song id
 * @param artist
 * @param name
 * @param path
 */
ymdl.pipe_from_id = (id, pipe) => {
  if (!id) return rej('Missing Deezer ID');
  if (!pipe) return rej('Missing pipe');

  ymdl.search_from_id(id).then(async (search) => {
    const yt_results = await ytsr(search.artist.name + ' ' + search.title + ' lyrics');
    const yt_result = Object.values(yt_results.items)[1];

    const stream = await ytdl(yt_result.url, { quality: "highest", filter: "audioonly" }).on("error", error => {
      console.error(error);
    }).on("info", info => {
      stream.pipe(pipe);
    }).on("finish", () => {
      return;
    });
  });
};

module.exports = ymdl;
