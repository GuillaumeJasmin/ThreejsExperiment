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
    '39':'right',
    // '122': 'top',
    // '115':'bottom',
    // '113':'left',
    // '100':'right'
};


var WebGL = (function(){
    
    function WebGL (){
        this.renderer = null;
        this.camera = null; 
        this.scene = null; 
        this.controls = null;
        this.water = null;
        this.modelsPath = 'assets/models/';
        this.countFrameToSendAPIInitial = 2;
        this.countFrameToSendAPI = this.countFrameToSendAPIInitial;
        this.lastUserInfo = {};
        this.usersList = [];
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

        this.firebaseInit();

        var self = this;

        this.params = params;
        
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
        var aMeshMirror = new THREE.Mesh(
            new THREE.PlaneGeometry(900000, 900000, 100, 100), 
            this.water.material
        );

        aMeshMirror.add(this.water);
        aMeshMirror.rotation.x = - Math.PI * 0.5;
        
        this.scene.add(aMeshMirror);

        this.loadSkyBox();

        this.resize(window.innerWidth, window.innerHeight);

        this.loadModels();

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
     * load .dae model
     */
    WebGL.prototype.loadModels = function () {

        var self = this;

        this.loader = new THREE.ColladaLoader();        
        this.loader.options.convertUpAxis = true;

        for(var modelName in modelsList) {
           if (modelsList.hasOwnProperty(modelName)) {
                this.loadColladaModel(modelName);
           }
        }

        this.manager = new THREE.LoadingManager();
        this.manager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );
        };

        this.OBJLoaderOnProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };


        this.OBJLoaderOnError = function ( xhr ) {};

        this.imgLoader = new THREE.ImageLoader(this.manager);
        this.OBJLoader = new THREE.OBJLoader(this.manager);

        for(var modelName in OBJList) {
            if (OBJList.hasOwnProperty(modelName)) {
                this.loadOBJModel(modelName);
            }
        }

        this.JSONLoader = new THREE.JSONLoader();

        for(var modelName in JSONObj) {
            if (JSONObj.hasOwnProperty(modelName)) {
                this.loadJSONModel(modelName);
            }
        }

    };

    /**
     * return void
     * async
     */
    WebGL.prototype.loadColladaModel = function (modelName) {
        var self = this;

        this.loader.load('assets/models/' + modelsList[modelName].file, function (collada) {
            modelsList[modelName].collada = collada;
            self.modelLoaded();
        });
    }

    /**
     * return void
     * async
     */
    WebGL.prototype.loadOBJModel = function (modelName) {
        var self = this;

        var texture = new THREE.Texture();
        this.imgLoader.load('assets/models/' + OBJList[modelName].imgFile, function (image) {
            texture.image = image;
            texture.needsUpdate = true;
            self.modelLoaded();
        });

        
        this.OBJLoader.load('assets/models/' + OBJList[modelName].objFile, function (object) {

            OBJList[modelName].obj = object;
            OBJList[modelName].obj.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material.map = texture;
                }
            });

            self.modelLoaded();

        }, this.OBJLoaderOnProgress, this.OBJLoaderOnError );
    }

    /**
     *
     */
    WebGL.prototype.loadJSONModel = function (modelName) {
        var self = this;

         // JSON
        this.JSONLoader.load('assets/models/' + JSONObj[modelName].file, function( geometry, materials ){

                // Remove smoothing to shader
                for( var mat = 0, length = materials.length; mat < length; mat++ ){
                    materials[mat].shading = THREE.FlatShading;
                };

                var obj = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
                obj.name = "barque";
                obj.animated = false;

                JSONObj[modelName].obj = obj

                self.modelLoaded();
        });


    }

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

        // this.addAircraftCarrier();
        
        this.addWhiteSHark();

        // this.addBarque();
        
        // this.addBob();
        // this.addPatrick();
        
        this.addRadeau();
        this.addRondoudou();

        // user
        this.addUser();
        this.barqueUser.add(this.camera);
        this.controlledObj = this.barqueUser;
        this.camera.position.set(0, 100, -300);



        // camera focus
        // this.cameraOnAircraftCarrier();
        // this.cameraOnPatrick();
        // this.cameraOnWhiteShark();
        // this.cameraOnBarque();

        // this.controlledObj = this.barque;

        this.params.onModelsLoaded();
    };

    WebGL.prototype.addCameras = function () {

        this.camera = new THREE.PerspectiveCamera(55.0, window.innerWidth / window.innerHeight, 0.5, 3000000);
        this.camera.position.set(1000, 500, -1500);
        this.camera.lookAt(new THREE.Vector3(0, 100, 0));
        
        // Initialize Orbit control
        this.OrbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement); 
        //this.controls = this.OrbitControls;
    };

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

        // this.directionalCenter = new THREE.DirectionalLight(0xffffff, 0.5);
        // this.directionalCenter.position.set(0, 20000, 500);
        // this.scene.add(this.directionalCenter);
        
        // var sphere = new THREE.Mesh(new THREE.SphereGeometry(this.lightSize, this.lightSize, this.lightSize), new THREE.MeshBasicMaterial({color: 0xffff00}));
        // sphere.overdraw = true;
        // sphere.position.set(this.directionalCenter.position.x, this.directionalCenter.position.y, this.directionalCenter.position.z);
        // self.scene.add(sphere);
    }

    WebGL.prototype.addAircraftCarrier = function () {
        this.aircraftCarrier = new AircraftCarrier();
    };

    WebGL.prototype.cameraOnAircraftCarrier  = function () {
        this.aircraftCarrier.obj.add(this.camera);
        this.camera.position.set(0, 300, -800);
        //this.camera.rotation.set(0.4, 0, 0);
    };

    WebGL.prototype.cameraOnPatrick  = function () {
        this.patrick.add(this.camera);
        this.camera.position.set(0, 0, -20);
        // this.camera.rotation.set(0.4, 0, 0);
    };

    WebGL.prototype.cameraOnBarque  = function () {
        this.barque.add(this.camera);
        this.camera.position.set(0, 100, -300);
        // this.camera.rotation.set(1, 0, 0);
    };

    WebGL.prototype.cameraOnWhiteShark  = function () {
        this.whiteSharkList[0].obj.add(this.camera);
        this.camera.position.set(0, 0, -20);
        //this.camera.rotation.set(0.4, 0, 0);
    };

    

    WebGL.prototype.addWhiteSHark = function () {

        this.whiteSharkList = [];

        for (var i = 0; i < 6; i += 1) {    
            var shark = new WhiteShark({
                randomPosition: true
            });

            shark.rotation.y = helper.getRandomAngle();

            scene.add(shark);

            this.whiteSharkList.push(shark);
        
            //this.shark.goDown();
        }
    };

    WebGL.prototype.addUser = function () {
        this.barqueUser = new Barque();
        this.avatarUser = new Bob();
        this.barqueUser.add(this.avatarUser);

        scene.add(this.barqueUser);
    };

    WebGL.prototype.addNewUser = function () {
        var barqueUser = new Barque();
        var avatarUser = new Bob();
        barqueUser.add(avatarUser);

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


    WebGL.prototype.addPatrick = function () {
        this.patrick = new Patrick();
        this.patrick.position.z = -50;
        this.barque.add(this.patrick);    
    };

    WebGL.prototype.addBob = function () {
        this.bob = new Bob();
        this.barque.add(this.bob);        
    };

    WebGL.prototype.addRondoudou = function () {
        this.rondoudou = new Rondoudou();
        this.rondoudou.position.z = -40;
        this.radeau.add(this.rondoudou);
    };

    WebGL.prototype.newParticule = function () {
        var self = this;
        if(this.nbParticule < 0) {
            return false;
        }

        this.nbParticule--;

        setTimeout(function (){
            sphere = new THREE.Mesh(new THREE.SphereGeometry(this.lightSize, this.lightSize, this.lightSize), new THREE.MeshBasicMaterial({color: 0xffff00}));
            sphere.overdraw = true;
            sphere.position.y = -10;
            self.scene.add(sphere);
            self.particulesList.push(sphere);
            self.newParticule();
        }, 500);
    }

    WebGL.prototype.loadSkyBox = function loadSkyBox() {

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

        var aSkybox = new THREE.Mesh(
          new THREE.CubeGeometry(1000000, 1000000, 1000000),
          aSkyBoxMaterial
        );
        
        this.scene.add(aSkybox);
    };

    WebGL.prototype.display = function () {
        this.water.render();
        this.renderer.render(this.scene, this.camera);
    },

    WebGL.prototype.render = function () {
        this.countFrameToSendAPI -= 1;
        this.water.material.uniforms.time.value += 1.5 / 60.0;
        
        // this.controls.update();
        this.OrbitControls.update();
        
        // this.camera.position.x += 2;

        // move sharks
        for (var i = 0; i < this.whiteSharkList.length; i += 1) {
            this.whiteSharkList[i].move();
        }

        // this.aircraftCarrier.move();
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

        if(this.userChange && this.countFrameToSendAPI < 0){
            this.countFrameToSendAPI = this.countFrameToSendAPIInitial;
            this.updateAPI();
        }

        this.display();
    },

    WebGL.prototype.resize = function (inWidth, inHeight) {
        this.camera.aspect = inWidth / inHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(inWidth, inHeight);
        this.display();
    }


    WebGL.prototype.firebaseInit = function () {

        var self = this;

        this.fbRef = new Firebase('https://bob-ocean.firebaseio.com');
        this.fbUsers = this.fbRef.child('users');

        this.fbUserRef = this.fbUsers.push();
        this.fbUserRef.set({
            name: '',
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

        // fb.set({ name: "Alex Wolfe" });

        // console.log(this.fbRef.child('users'));

        // debugger;

        // this.fbUsers.on('value', function(snapshot) {
        //     console.log('update', snapshot.val());
        // });

        // this.fbUsers.on('child_added', function(user) {
            
        //     var userKey = user.name();

        //     if(userKey === self.fbUserRefKey){
        //         console.info('it same user');
        //         return false;
        //     }

        //     var userVal = user.val();

        //     console.info(userVal);

        //     self.usersList[userKey] = {};
        //     self.usersList[userKey].obj = self.addNewUser();

        //     // self.usersList[userKey].api = userVal;
        //     self.usersList[userKey].obj.position.x = userVal.position.x;
        //     self.usersList[userKey].obj.position.y = userVal.position.y;
        //     self.usersList[userKey].obj.position.z = userVal.position.z;

        //     self.usersList[userKey].obj.rotation.x = userVal.rotation.x;
        //     self.usersList[userKey].obj.rotation.y = userVal.rotation.y;
        //     self.usersList[userKey].obj.rotation.z = userVal.rotation.z;
        // });

        this.fbUsers.on('child_added', function (user) {

            var userKey = user.name();

            if(user.name() === self.fbUserRefKey){
                console.info('it same user added');
                return false;
            }

            var userVal = user.val();

            self.usersList[userKey] = {};
            // self.usersList[userKey].api = user.val();
            self.usersList[userKey].obj = self.addNewUser();
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
                console.info('it same user 33');
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

    WebGL.prototype.updateAPI = function () {
        // console.log('send to API');

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

    return WebGL;

})();


