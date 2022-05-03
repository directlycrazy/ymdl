/*

Use the module to get information about a song

*/

const ymdl = require('../index.js');

var artist = 'ARTIST';
var song_name = 'SONG_NAME';

ymdl.search(artist, song_name).then(data => {
	if (data) {
		console.log(data);
	} else {
		return console.error('No song found');
	}
}).catch((e) => {
	return console.error(e);
});