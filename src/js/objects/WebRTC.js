var WebRTC = (function(){
    /**
     * @constructor WebRTC
     */
    function WebRTC (params) {
        var self = this;
        this.params = params;

        this.id = params.id;
        this.connections = [];

        this.peer = new Peer(params.id, {
            host: params.host,
            port: params.port,
            path: params.path || '/'
        });

        this.peer.on('open', this.onOpen, this);
        this.peer.on('connection', this.addConnection, this);

        window.onbeforeunload = self.disconnect;
    }

    /**
     * @return void
     */
    WebRTC.prototype.onOpen = function (id) {
        console.log('My peer ID is: ' + id);
        this.params.onReady();
    };

    /**
     * @return void
     */
    WebRTC.prototype.connect = function(id, metadata) {
        var connection = this.peer.connect(id, {
            metadata: metadata
        });
        this.addConnection(connection);

        // console.log('connection connected', connection);
    };

    /**
     * @return void
     */
    WebRTC.prototype.addConnection = function(connection) {
        var self = this;

        if(this.params.onData){
            this.onConnectionData = this.params.onData;
        }

        if(this.params.onConnectionOpen){
            this.onConnectionOpen = this.params.onConnectionOpen;
        }

        connection.on('open', function () {
            self.onConnectionOpen(this);
        });

        connection.on('data', function (data) {
            self.onConnectionData(this, data);
        });

        connection.on('close', function () {
            self.onConnectionClose(this);
        });

        this.connections.push(connection);
    };

    /**
     * @return void
     */
    WebRTC.prototype.onConnectionOpen = function (connection) {
        console.log('connection open', connection);
    };

    /**
     * @return void
     */
    WebRTC.prototype.onConnectionData = function (connection, data) {
        // console.log('data recieved', data);
    };

    /**
     * @return void
     */
    WebRTC.prototype.onConnectionClose = function (connection) {
        this.deleteConnection(connection);
    };

    /**
     * @return void
     */
    WebRTC.prototype.broadcast = function(data) {
        for(var i = 0; i < this.connections.length; i += 1) {
            // console.log('send to ', this.connections[i]);
            data.type = 'broadcast';
            data.id = this.params.id;
            this.connections[i].send(data);
        }
    };

    /**
     * @return void
     */
    WebRTC.prototype.send = function(params) {
        var connection = _.find(this.connections, {
            peer: this.getConnectedUser()[0]
        });

        connection.send(params.data);
    };

    /**
     * @return array
     * array of connected users
     */
    WebRTC.prototype.getConnectedUser = function () {
        var xmlHttp = null;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', 'http://threejs-experiment.guillaume-jasmin.fr:9001/getconnected', false );
        xmlHttp.send(null);
        var conntectedUsers = JSON.parse(xmlHttp.responseText);

        conntectedUsers.splice(conntectedUsers.indexOf(this.id), 1);

        return conntectedUsers;
    }

    /**
     * @return void
     */
    WebRTC.prototype.connectToAll = function (metadata) {
        var userConnected = this.getConnectedUser();
        console.info(userConnected);
        for(var i = 0; i < userConnected.length; i += 1) {
            this.connect(userConnected[i], metadata);
        }
    }

    /**
     * @return void
     * execute when page is close
     */
    WebRTC.prototype.disconnect = function () {};

    /**
     * @return void
     * delete connection from array this.connections
     */
    WebRTC.prototype.deleteConnection = function (connection) {
        console.log('delete ' + connection.peer);
        this.connections.splice(this.connections.indexOf(connection), 1);
    };

    return WebRTC;

})();
