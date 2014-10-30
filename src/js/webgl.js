var socket;

var scene;

var modelsList = {
    'WhiteShark': {
        file: 'whiteShark.dae'
    },
    'Patrick': {
        file: 'Patrick.dae'
    },
    'Radeau': {
        file: 'radeau.dae'
    },
    'Rondoudou': {
        file: 'rondoudou.dae'
    }
};


var OBJList = {
    'AircraftCarrier': {
        objFile: 'Aircraft/Aircraft Carrier.obj',
        imgFile: 'Aircraft/Acft Carrier Top.jpg'
    }
};

var JSONObj = {
    'Barque': {
        file: 'Barque/OldBoat.json'
    },
    'Bob': {
        file: 'Bob/Bob.json'
    },
    'Aircraft': {
        file: 'Aircraft.json'
    }
}

var keyCode = {
    '38': 'top',
    '40':'bottom',
    '37':'left',
    '39':'right'
};


var WebGL = (function(){
    
    function WebGL (params){
        this.params = params;
        this.avatar = this.params.avatar;
        this.renderer = null;
        this.camera = null; 
        this.scene = null; 
        this.controls = null;
        this.water = null;
        this.modelsPath = 'assets/models/';
        this.countFrameToSendAPIInitial = 1;
        this.countFrameToSendAPI = this.countFrameToSendAPIInitial;
        this.lastUserInfo = {};
        this.usersList = [];
        this.multiplayer = this.params.multiplayer;
    };


    WebGL.prototype.enable = (function enable() {
        try {
            var aCanvas = document.createElement('canvas');
            return !! window.WebGLRenderingContext && (aCanvas.getContext('webgl') || aCanvas.getContext('experimental-webgl'));
        }
        catch(e) {
            return false;
        }
    })();

    WebGL.prototype.initialize = function (params) {


        // if(this.multiplayer){
        //     // this.firebaseInit();
        // }

        this.firebaseInit();
        
        // this.initSocket();

        var self = this;

        $('#rondoudou-sound').on('ended', function() {
           $('#rondoudou-sound')[0].load();
           self.rondoudouIsPlaying = false;
        });

        $('#rondoudou-sound')[0].volume = 1;

        var self = this;

        this.params = params;

        this.loadModels();
        
        // Initialize Renderer, Camera and Scene
        this.renderer = this.enable? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        this.scene = new THREE.Scene();
        scene = this.scene;
        
        this.addCameras();

        this.addLights();

        // Load textures        
        var waterNormals = new THREE.ImageUtils.loadTexture('../assets/img/waternormals.jpg');
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 
        
        // Create the water effect
        this.water = new THREE.Water(this.renderer, this.camera, this.scene, {
            textureWidth: 256,
            textureHeight: 256,
            waterNormals: waterNormals,
            alpha:  1.0,
            sunDirection: this.directionalLightRight.position.normalize(),
            sunColor: 0xffffff,
            waterColor: 0x001e5f,
            betaVersion: 0,
            side: THREE.DoubleSide
        });
        this.aMeshMirror = new THREE.Mesh(
            new THREE.PlaneGeometry(900000, 900000, 100, 100), 
            this.water.material
        );

        this.aMeshMirror.add(this.water);
        this.aMeshMirror.rotation.x = - Math.PI * 0.5;

        this.loadSkyBox();

        this.resize(window.innerWidth, window.innerHeight);

        window.addEventListener('keydown', function (event) {self.onKeydown(event)}, false);
        window.addEventListener('keyup', function (event) {self.onKeyup(event)}, false);

    };

    WebGL.prototype.onKeydown = function (event) {
        
        switch(keyCode[event.keyCode]){
            case 'top':
                this.controlledObj.startForward();
                break;

            case 'bottom':
                this.controlledObj.startBackward();
                break;

            case 'left':
                this.controlledObj.startRotationLeft();
                break;

            case 'right':
                this.controlledObj.startRotationRight();
                break;

            default:
                return false;
                break;
        }

    };

    WebGL.prototype.onKeyup = function (event) {
        
        switch(keyCode[event.keyCode]){
            case 'top':
                this.controlledObj.stopForward();
                break;

            case 'bottom':
                this.controlledObj.stopBackward();
                break;

            case 'left':
                this.controlledObj.stopRotationLeft();
                break;

            case 'right':
                this.controlledObj.stopRotationRight();
                break;

            default:
                return false;
                break;
        }

    };


    /**
     * @return void
    */
    WebGL.prototype.modelLoaded = _.after((_.size(modelsList) + _.size(OBJList) * 2 + _.size(JSONObj)), function () {
        this.onModelsLoaded();
    });

    /**
     * 
     */
    WebGL.prototype.onModelsLoaded = function () {

        this.addAircraftCarrier();

        this.scene.add(this.aMeshMirror);
        this.scene.add(this.aSkybox);
        
        this.addWhiteSHark();
        
        this.addRadeau();
        this.addRondoudou();

        // current user
        this.addUser(this.avatar);
        this.barqueUser.add(this.camera);
        this.controlledObj = this.barqueUser;
        this.camera.position.set(0, 100, -300);

        this.params.onModelsLoaded();

    };

    WebGL.prototype.addCameras = function () {

        this.camera = new THREE.PerspectiveCamera(55.0, window.innerWidth / window.innerHeight, 0.5, 3000000);
        this.camera.position.set(1000, 500, -1500);
        this.camera.lookAt(new THREE.Vector3(0, 100, 0));
        
        // Initialize Orbit control
        this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement); 
        //this.controls = this.orbitControls;
    };

    /**
     * @return void
     */
    WebGL.prototype.addLights = function () {

        this.lightSize = 100;

        // Add light
        this.directionalLightRight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLightRight.position.set(-50000, 25000, -50000);
        this.scene.add(this.directionalLightRight);
        
        var sphere = new THREE.Mesh(new THREE.SphereGeometry(this.lightSize, this.lightSize, this.lightSize), new THREE.MeshBasicMaterial({color: 0xffff00}));
        sphere.overdraw = true;
        sphere.position.set(this.directionalLightRight.position.x, this.directionalLightRight.position.y, this.directionalLightRight.position.z);
        self.scene.add(sphere);

        var directionalLightLeft = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLightLeft.position.set(50000, 25000, -50000);
        this.scene.add(directionalLightLeft);
        
        var sphere = new THREE.Mesh(new THREE.SphereGeometry(this.lightSize, this.lightSize, this.lightSize), new THREE.MeshBasicMaterial({color: 0xffff00}));
        sphere.overdraw = true;
        sphere.position.set(directionalLightLeft.position.x, directionalLightLeft.position.y, directionalLightLeft.position.z);
        self.scene.add(sphere);

        this.directionalLightTop = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLightTop.position.set(0, 25000, 50000);
        this.scene.add(this.directionalLightTop);
        
        var sphere = new THREE.Mesh(new THREE.SphereGeometry(this.lightSize, this.lightSize, this.lightSize), new THREE.MeshBasicMaterial({color: 0xffff00}));
        sphere.overdraw = true;
        sphere.position.set(this.directionalLightTop.position.x, this.directionalLightTop.position.y, this.directionalLightTop.position.z);
        self.scene.add(sphere);

    }

    /**
     * @return void
     */
    WebGL.prototype.addAircraftCarrier = function () {
        this.aircraftCarrier = new AircraftCarrier();
    };

    /**
     * @return void
     */
    WebGL.prototype.cameraOnAircraftCarrier  = function () {
        this.aircraftCarrier.obj.add(this.camera);
        this.camera.position.set(0, 300, -800);
    };

    /**
     * @return void
     */
    WebGL.prototype.cameraOnWhiteShark  = function () {
        this.whiteSharkList[0].obj.add(this.camera);
        this.camera.position.set(0, 0, -20);
    };


    /**
     * @return void
     */
    WebGL.prototype.addWhiteSHark = function () {

        this.whiteSharkList = [];

        for (var i = 0; i < 10; i += 1) {    
            var shark = new WhiteShark({
                randomPosition: true
            });

            shark.rotation.y = helper.getRandomAngle();
            scene.add(shark);
            this.whiteSharkList.push(shark);
        
        }
    };

    WebGL.prototype.addUser = function (avatar) {

        if(avatar === 'Bob'){
            this.avatarUser = new Bob();
        }
        else if (avatar === 'Patrick'){
            this.avatarUser = new Patrick();
        }

        this.barqueUser = new Barque();
        this.barqueUser.add(this.avatarUser);

        scene.add(this.barqueUser);

        // socker.io
        // socket.emit('newUser', {
        //     position: {
        //         x: this.barqueUser.position.x,
        //         y: this.barqueUser.position.y,
        //         z: this.barqueUser.position.z
        //     },
        //     rotation: {
        //         x: this.barqueUser.rotation.x,
        //         y: this.barqueUser.rotation.y,
        //         z: this.barqueUser.rotation.z
        //     }
        // });
    };

    WebGL.prototype.addNewUser = function (avatar) {
        if(avatar === 'Bob'){
            var userAvatar = new Bob();
        }
        else if (avatar === 'Patrick'){
            var userAvatar = new Patrick();
        }
        var barqueUser = new Barque();
        barqueUser.add(userAvatar);

        scene.add(barqueUser);

        return barqueUser;
    };

    WebGL.prototype.addRadeau = function () {
        this.radeau = new Radeau();

        this.radeau.position.x = -500;
        this.radeau.rotation.y = helper.getRandomAngle();

        scene.add(this.radeau);
    };

    WebGL.prototype.addBarque = function () {
        this.barque = new Barque();
        scene.add(this.barque);
    };

    WebGL.prototype.addRondoudou = function () {
        this.rondoudou = new Rondoudou();
        this.rondoudou.position.z = -40;
        this.radeau.add(this.rondoudou);
    };

    WebGL.prototype.loadSkyBox = function loadSkyBox() {

        var self = this;

        var box = 'box-lakel';        
        var aCubeMap = THREE.ImageUtils.loadTextureCube([
          'assets/img/' + box + '/west.jpg',
          'assets/img/' + box + '/east.jpg',
          'assets/img/' + box + '/top.jpg',
          'assets/img/' + box + '/bottom.jpg',
          'assets/img/' + box + '/south.jpg',
          'assets/img/' + box + '/north.jpg', 
        ]);
        aCubeMap.format = THREE.RGBFormat;

        var aShader = THREE.ShaderLib['cube'];
        aShader.uniforms['tCube'].value = aCubeMap;

        var aSkyBoxMaterial = new THREE.ShaderMaterial({
          fragmentShader: aShader.fragmentShader,
          vertexShader: aShader.vertexShader,
          uniforms: aShader.uniforms,
          depthWrite: false,
          side: THREE.BackSide
        });

        self.aSkybox = new THREE.Mesh(
          new THREE.CubeGeometry(1000000, 1000000, 1000000),
          aSkyBoxMaterial
        );
    
    };

    WebGL.prototype.display = function () {
        this.water.render();
        this.renderer.render(this.scene, this.camera);
    },

    WebGL.prototype.render = function () {
        this.countFrameToSendAPI -= 1;
        this.water.material.uniforms.time.value += 1.5 / 60.0;
        
        this.orbitControls.update();
        

        // move sharks
        for (var i = 0; i < this.whiteSharkList.length; i += 1) {
            this.whiteSharkList[i].move();
        }

        this.aircraftCarrier.move();
        this.radeau.move();

        this.userChange = false;

        if(this.controlledObj.movingForward){
            this.userChange = true;
            this.controlledObj.translateZ(4);
        }
        else if(this.controlledObj.movingBackward) {
            this.userChange = true;
            this.controlledObj.translateZ(-4);
        }

        if(this.controlledObj.rotatingLeft){
            this.userChange = true;
            this.controlledObj.rotation.y += 0.02;
        }
        else if(this.controlledObj.rotatingRight) {
            this.userChange = true;
            this.controlledObj.rotation.y -= 0.02;
        }

        this.checkRondoudou();

   
        if(this.userChange && this.countFrameToSendAPI < 0){
            this.countFrameToSendAPI = this.countFrameToSendAPIInitial;
            this.updateAPI();
        }    

        // this.updateSocket();

        this.display();
    },

    WebGL.prototype.resize = function (inWidth, inHeight) {
        this.camera.aspect = inWidth / inHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(inWidth, inHeight);
        this.display();
    }


    WebGL.prototype.initSocket = function () {
        var self = this;

        socket = io.connect('http://guillaume.local:9003');


        socket.on('newUser', function(data) {
            self.usersList[data.userKey] = {
                obj: null
            };
            self.usersList[data.userKey].obj = self.addNewUser();
            self.usersList[data.userKey].obj.position.x = data.data.position.x;
            self.usersList[data.userKey].obj.position.y = data.data.position.y;
            self.usersList[data.userKey].obj.position.z = data.data.position.z;
            self.usersList[data.userKey].obj.rotation.x = data.data.rotation.x;
            self.usersList[data.userKey].obj.rotation.y = data.data.rotation.y;
            self.usersList[data.userKey].obj.rotation.z = data.data.rotation.z;
        });

        socket.on('userUpdate', function (data) {
            self.usersList[data.userKey].obj.position.x = data.data.position.x;
            self.usersList[data.userKey].obj.position.y = data.data.position.y;
            self.usersList[data.userKey].obj.position.z = data.data.position.z;
            self.usersList[data.userKey].obj.rotation.x = data.data.rotation.x;
            self.usersList[data.userKey].obj.rotation.y = data.data.rotation.y;
            self.usersList[data.userKey].obj.rotation.z = data.data.rotation.z;
        });

        socket.on('initOtherUser', function (data) {
            

            for(var userKey in data.users) {
                if (data.users.hasOwnProperty(userKey) && userKey !== data.myUserKey) {
                    self.usersList[userKey] = {
                        obj: null
                    };
                    self.usersList[userKey].obj = self.addNewUser();
                    self.usersList[userKey].obj.position.x = data.users[userKey].position.x;
                    self.usersList[userKey].obj.position.y = data.users[userKey].position.y;
                    self.usersList[userKey].obj.position.z = data.users[userKey].position.z;
                    self.usersList[userKey].obj.rotation.x = data.users[userKey].rotation.x;
                    self.usersList[userKey].obj.rotation.y = data.users[userKey].rotation.y;
                    self.usersList[userKey].obj.rotation.z = data.users[userKey].rotation.z;
               }
            }
        });

        
    };


    /**
     * @return void
     * async
     */
    WebGL.prototype.firebaseInit = function () {

        var self = this;

        this.fbRef = new Firebase('https://bob-ocean.firebaseio.com');
        this.fbUsers = this.fbRef.child('users');

        this.fbUserRef = this.fbUsers.push();
        this.fbUserRef.set({
            name: '',
            avatar: this.avatar,
            position : {
                x: 0,
                y: 0,
                z: 0
            },
            rotation : {
                x: 0,
                y: 0,
                z: 0
            }
        });
        // We've appended a new message to the message_list location.
        // var path = this.fbUserRef.toString();

        this.fbUserRefKey = this.fbUserRef.toString().replace('https://bob-ocean.firebaseio.com/users/', '');

        this.fbUsers.on('child_added', function (user) {

            var userKey = user.name();

            if(user.name() === self.fbUserRefKey){
                return false;
            }

            var userVal = user.val();

            self.usersList[userKey] = {
                obj: null
            };
            // self.usersList[userKey].api = user.val();
            self.usersList[userKey].obj = self.addNewUser(userVal.avatar);
            self.usersList[userKey].obj.position.x = userVal.position.x;
            self.usersList[userKey].obj.position.y = userVal.position.y;
            self.usersList[userKey].obj.position.z = userVal.position.z;

            self.usersList[userKey].obj.rotation.x = userVal.rotation.x;
            self.usersList[userKey].obj.rotation.y = userVal.rotation.y;
            self.usersList[userKey].obj.rotation.z = userVal.rotation.z;
        });

        this.fbUsers.on('child_changed', function (user) {

            var userKey = user.name();

            if(userKey === self.fbUserRefKey){
                return false;
            }

            var userVal = user.val();

            // self.usersList[userKey].api = userVal;
            self.usersList[userKey].obj.position.x = userVal.position.x;
            self.usersList[userKey].obj.position.y = userVal.position.y;
            self.usersList[userKey].obj.position.z = userVal.position.z;

            self.usersList[userKey].obj.rotation.x = userVal.rotation.x;
            self.usersList[userKey].obj.rotation.y = userVal.rotation.y;
            self.usersList[userKey].obj.rotation.z = userVal.rotation.z;
        });

    };

    /**
     * @return void
     */
    WebGL.prototype.updateAPI = function () {
        this.fbUserRef.update({
            position: {    
                x: this.barqueUser.position.x,
                y: this.barqueUser.position.y,
                z: this.barqueUser.position.z
            },
            rotation: {    
                x: this.barqueUser.rotation.x,
                y: this.barqueUser.rotation.y,
                z: this.barqueUser.rotation.z
            }
        });
    }

    /**
     * @return void
     */
    WebGL.prototype.updateSocket = function () {
        socket.emit('userUpdate', {
            position: {
                x: this.barqueUser.position.x,
                y: this.barqueUser.position.y,
                z: this.barqueUser.position.z
            },
            rotation: {
                x: this.barqueUser.rotation.x,
                y: this.barqueUser.rotation.y,
                z: this.barqueUser.rotation.z
            }
        });
    };

    /**
     * @return void
     */
    WebGL.prototype.checkRondoudou = function () {
        if(Math.abs(this.barqueUser.position.x - this.radeau.position.x) < 300){
            if(Math.abs(this.barqueUser.position.z - this.radeau.position.z) < 300){
                this.startRondoudouSound();
            }
        }
    }
    
    /**
     * @return void
     */
    WebGL.prototype.startRondoudouSound = function () {
        if(this.rondoudouIsPlaying){
            return false;
        }

        this.rondoudouIsPlaying = true;
        $('#rondoudou-sound')[0].play();


    };

    _.merge(WebGL.prototype, ModelsLoader.prototype);

    return WebGL;

})();


