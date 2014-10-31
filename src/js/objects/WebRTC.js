// var WebRCT = (function (){

//     function WebRCT (params) {

//         this.connectionsRecieves = [];

//         peer = new Peer(params.id, {host: 'localhost', port: 9000, path: '/'});

//         peer.on('connection', this.onConnectionRecieve);
//     }

//     this.prototype.onConnectionRecieve = function (connection) {
//         connectionsRecieves.push(connection);
//     };

//     return WebRCT;

// })();






var peer;
var connectionToSend;
var connectionToRecieve;

$('#open-connection').on('click', function () {

    peer = new Peer($('#open-connection-value').val(), {host: 'localhost', port: 9000, path: '/'});

    peer.on('connection', function(conn) {

        connectionToRecieve = conn;

        console.log('new connection ', connectionToRecieve);

        connectionToRecieve.on('data', function(data){
            // Will print 'hi!'
            console.log(data);
            alert(data);
        });

    });

    peer.on('open', function(id) {
        console.log('My peer ID is: ' + id);
    });

});

// connect to
$('#connect-to').on('click', function () {

    connectionToSend = peer.connect($('#connect-to-value').val());

    connectionToSend.on('open', function() {

        console.log('connection open');

        // Receive messages
        connectionToSend.on('data', function(data) {
            console.log('Received', data);
            alert(data);
        });

        // Send messages
        connectionToSend.send('Hello!');
    });

});


$('#send-message').on('click', function () {
    connectionToSend.send($('#message').val());
});

$('#send-response').on('click', function () {
    connectionToRecieve.send($('#response').val());
});










