const express = require('express');
const ymdl = require('./ymdl');

const app = express();

app.get('/stream/:artist/:name', (req, res) => {
	if (!req.params.artist || !req.params.name) return res.sendStatus(400);
	ymdl.pipe(req.params.artist, req.params.name, res);
});

app.listen(3000);