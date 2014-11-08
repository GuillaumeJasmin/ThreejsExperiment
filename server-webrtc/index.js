var PeerServer = require('peer').PeerServer;
var express = require('express');

var server = new PeerServer({host: 'threejs-experiment.guillaume-jasmin.fr', port: 9000, path: '/'});
var connectedUser = [];

// add user
server.on('connection', function (id, a) {
	connectedUser.push(id);
	// console.log('add', connectedUser);
});

// remove user
server.on('disconnect', function (id) {
	connectedUser.splice(connectedUser.indexOf(id), 1);
	// console.log('delete', connectedUser);
});


var app = express();

app.get('/getconnected', function(req, res){
	// res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
	res.send(connectedUser);
});

app.listen(9001);
