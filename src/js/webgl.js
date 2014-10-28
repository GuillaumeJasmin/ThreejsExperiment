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
    'Barque': {
        file: 'barque.dae'
    }
};


var OBJList = {
    'AircraftCarrier': {
        objFile: 'Aircraft/Aircraft Carrier.obj',
        imgFile: 'Aircraft/Acft Carrier Top.jpg'
    }
};


var WebGL = (function(){
    
    function WebGL (){
        this.renderer = null;
        this.camera = null; 
        this.scene = null; 
        this.controls = null;
        this.water = null;
        this.modelsPath = 'assets/models/';
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

        // this.cameraOnAircraftCarrier();

        this.loadModels();

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

    };

    /**
     * return void
     * async
     */
    WebGL.prototype.loadColladaModel = function (modelName) {
        var self = this;

        this.loader.load('assets/models/' + modelsList[modelName].file, function (collada) {
            modelsList[modelName].obj = collada;
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
     * @return void
     */
    WebGL.prototype.modelLoaded = _.after((_.size(modelsList) + _.size(OBJList) * 2), function () {
        this.onModelsLoaded();
    });

    /**
     * 
     */
    WebGL.prototype.onModelsLoaded = function () {

        this.addAircraftCarrier();
        this.addBarque();
        this.addPatrick();
        this.addWhiteSHark();
        this.addRadeau();

        this.params.onModelsLoaded();
    };

    WebGL.prototype.addCameras = function () {

        this.camera = new THREE.PerspectiveCamera(55.0, window.innerWidth / window.innerHeight, 0.5, 3000000);
        this.camera.position.set(1000, 500, -1500);
        this.camera.lookAt(new THREE.Vector3(0, 100, 0));
        
        // Initialize Orbit control
        this.OrbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement); 
        this.controls = this.OrbitControls;
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

    WebGL.prototype.addWhiteSHark = function () {

        this.whiteSharkList = [];

        for (var i = 0; i < 10; i += 1) {    
            var shark = new WhiteShark({
                randomPosition: true
            });

            this.whiteSharkList.push(shark);
        
            //this.shark.goDown();    
        }
    };

    WebGL.prototype.addRadeau = function () {
        this.radeau = new Radeau();
    };

    WebGL.prototype.addBarque = function () {
        this.barque = new Barque();
    };


    WebGL.prototype.addPatrick = function () {
        this.patrick = new Patrick();
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
        this.water.material.uniforms.time.value += 1.5 / 60.0;
        
        this.controls.update();
        
        // this.camera.position.x += 2;

        // this.barque.position.z += 2;
        // this.barque.rotation.y += 0.01;

        // move sharks
        for (var i = 0; i < this.whiteSharkList.length; i += 1) {
            this.whiteSharkList[i].move();
        }

        // this.cameraOnAircraftCarrier();

        this.aircraftCarrier.move();

        this.display();
    },

    WebGL.prototype.resize = function (inWidth, inHeight) {
        this.camera.aspect = inWidth / inHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(inWidth, inHeight);
        this.display();
    }

    return WebGL;

})();


