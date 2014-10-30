var io = require('socket.io').listen(9003);
// var EE = require('events').EventEmitter;
// var pubsub = new EE();

var userList = {};
var increment = 0;
var user;



io.sockets.on('connection', function (socket, data) {

	console.log('new connection ', data);

	var userKey = 'user-' + increment;

	// socket.set('userKey', userKey);

	// socket.get('userKey', function (error, data) {
	//     console.log('get user', data);
	// });

	increment++;

	// socket.broadcast.emit('newUser', 'noveaou user');

	socket.on('newUser', function(data) {
 	    
 	    userList[userKey] = data;

 	    socket.emit('initOtherUser', {
 	    	myUserKey: userKey,
 	    	users: userList
 	    });

 	    socket.broadcast.emit('newUser', {
 	    	userKey: userKey,
 	    	data: userList[userKey]
 	    });
 	});

 	socket.on('userUpdate', function(data) {
		
 		console.log('update user', userKey);

 	    userList[userKey] = data;

 	    socket.broadcast.emit('userUpdate', {
 	    	userKey: userKey,
 	    	data: userList[userKey]
 	    });
 	});


	// var user = 'user-' + increment;

	// increment++

	// userList[user] = {
	// 	position: 12
	// }

	// console.log('userList', userList);

 //    // Quand on client se connecte, on lui envoie un message
 //    socket.emit('message', 'Vous êtes bien connecté avec user !' + user);
    
 //    // On signale aux autres clients qu'il y a un nouveau venu
 //    socket.broadcast.emit('message', 'Un autre client vient de se connecter avec user ! ' + user);

 //    // Dès qu'on nous donne un pseudo, on le stocke en variable de session
 //    socket.on('petit_nouveau', function(pseudo) {
 //        socket.set('pseudo', pseudo);
 //    });

 //    // Dès qu'on reçoit un "message" (clic sur le bouton), on le note dans la console
 //    socket.on('message', function (message) {
 //        // On récupère le pseudo de celui qui a cliqué dans les variables de session
 //        socket.get('pseudo', function (error, pseudo) {
 //            console.log(pseudo + ' me parle ! Il me dit : ' + message);
 //        });
 //    });
});


io.sockets.on('disconnect', function (socket, pseudo) {

	var index = userList.indexOf()

});