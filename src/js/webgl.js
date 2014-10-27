var scene;

var WebGL = (function(){

    // var startTime   = Date.now();
    
    function WebGL (){
        this.renderer = null;
        this.camera = null; 
        this.scene = null; 
        this.controls = null;
        this.water = null;
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

    WebGL.prototype.initialize = function () {
        
        // Initialize Renderer, Camera and Scene
        this.renderer = this.enable? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        this.scene = new THREE.Scene();
        scene = this.scene;
        
        this.camera = new THREE.PerspectiveCamera(55.0, window.innerWidth / window.innerHeight, 0.5, 3000000);
        this.camera.position.set(1000, 500, -1500);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        
        // Initialize Orbit control     
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        // Add light
        var directionalLight = new THREE.DirectionalLight(0xffff55, 1);
        directionalLight.position.set(-600, 300, 600);
        this.scene.add(directionalLight);
        
        // Load textures        
        var waterNormals = new THREE.ImageUtils.loadTexture('../assets/img/waternormals.jpg');
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 
        
        // Create the water effect
        this.water = new THREE.Water(this.renderer, this.camera, this.scene, {
            textureWidth: 256,
            textureHeight: 256,
            waterNormals: waterNormals,
            alpha:  1.0,
            sunDirection: directionalLight.position.normalize(),
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

        // this.generateParticules();

        this.orque();

    };

    WebGL.prototype.orque = function () {
        // var loader = new THREE.JSONLoader(); // init the loader util

        // // init loading
        // loader.load('assets/img/leeperrysmith/LeePerrySmith.js', function (geometry) {
        //   // create a new material
        //   var material = new THREE.MeshLambertMaterial({
        //     map: THREE.ImageUtils.loadTexture('assets/img/leeperrysmith/Map-COL.jpg'),  // specify and load the texture
        //     colorAmbient: [0.480000026226044, 0.480000026226044, 0.480000026226044],
        //     colorDiffuse: [0.480000026226044, 0.480000026226044, 0.480000026226044],
        //     colorSpecular: [0.8999999761581421, 0.8999999761581421, 0.8999999761581421]
        //   });
          
        //   // create a mesh with models geometry and material
        //   var mesh = new THREE.Mesh(
        //     geometry,
        //     material
        //   );

        //   mesh.position.y = 5;
          
        //   mesh.rotation.y = -Math.PI/5;
          
        //   this.scene.add(mesh);
        // });

        var that = this;

        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {

            console.log( item, loaded, total );

        };

        var texture = new THREE.Texture();

        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };

        var onError = function ( xhr ) {
        };


        // var loader = new THREE.ImageLoader( manager );
        //         loader.load('assets/img/leeperrysmith/Map-COL.jpg', function ( image ) {

        //             texture.image = image;
        //             texture.needsUpdate = true;

        // });


        var loader = new THREE.OBJLoader( manager );
        loader.load('assets/img/boat.obj', function ( object ) {

            object.traverse( function ( child ) {

                if ( child instanceof THREE.Mesh ) {

                    child.material.map = texture;

                }

            } );

            console.log('object', object);

            object.position.y = 1;
            that.scene.add( object );

        }, onProgress, onError );


    };

    WebGL.prototype.generateParticules = function () {

        this.particulesList = [];
        
        this.nbParticule = 20;

        this.newParticule();
        
    };

    WebGL.prototype.newParticule = function () {
        var that = this;
        if(this.nbParticule < 0) {
            return false;
        }

        this.nbParticule--;

        setTimeout(function (){
            sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 50, 50), new THREE.MeshBasicMaterial({color: 0xffff00}));
            sphere.overdraw = true;
            sphere.position.y = -10;
            that.scene.add(sphere);
            that.particulesList.push(sphere);
            that.newParticule();
        }, 500);
    }

    WebGL.prototype.loadSkyBox = function loadSkyBox() {

        // var box = 'box-old';
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

       //  var dtime   = Date.now() - startTime;
        // this.cube.scale.x    = 1.0 + 0.3 * Math.sin(dtime / 300);
        // this.cube.scale.y    = 1.0 + 0.3 * Math.sin(dtime / 300);
        // this.cube.scale.z    = 1.0 + 0.3 * Math.sin(dtime / 300);
        // this.engine.update( 0.01 * 0.5 );

        // for(var i = 0; i < this.particulesList.length; i += 1){
        //     this.particulesList[i].position.y += 10;
        // }

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


