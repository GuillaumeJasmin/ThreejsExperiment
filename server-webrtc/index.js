var PeerServer = require('peer').PeerServer;

var server = new PeerServer({port: 9000, path: '/'});

server.on('connection', function(id) {
    console.log('id', id);
});