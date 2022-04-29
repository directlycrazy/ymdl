/*

Use the module to create an mp3 file with metadata

*/

const ymdl = require('../index.js');
const { exec } = require('child_process');

var artist = 'ARTIST';
var song_name = 'SONG_NAME';
var ffmpeg_path = 'FFMPEG_PATH';

ymdl.download(artist, song_name, __dirname).then((search) => {
  exec(`${ffmpeg_path}/ffmpeg.exe -i "${search.artist.name} - ${search.title}.webm" -metadata artist="${search.artist.name}" -metadata title="${search.title}" -metadata album="${search.album.title}" -b:a 128k "${search.title}.mp3"`, () => {
    fs.unlink(`${__dirname}/${search.artist.name} - ${search.title}.webm`, (err) => {
      return;
    });
  });
}).catch((error) => {
  console.error(error);
});
