// var Webgl = (function(){

//     // function Webgl(width, height){
//     //     // Basic three.js setup
//     //     this.scene = new THREE.Scene();
        
//     //     this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
//     //     this.camera.position.z = 500;

//     //     this.renderer = new THREE.WebGLRenderer();
//     //     this.renderer.setSize(width, height);
//     //     this.renderer.setClearColor(0x2D2D2D);

//     //     // Directly add objects
//     //     this.someObject = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: true}));
//     //     this.someObject.position.set(-60, 0, 0);
//     //     this.scene.add(this.someObject);

//     //     // Or create container classes for them to simplify your code
//     //     this.someOtherObject = new Sphere();
//     //     this.someOtherObject.position.set(60, 0, 0);
//     //     this.scene.add(this.someOtherObject);
//     // }

//     // Webgl.prototype.resize = function(width, height) {
//     //     this.camera.aspect = width / height;
//     //     this.camera.updateProjectionMatrix();
//     //     this.renderer.setSize(width, height);
//     // };

//     // Webgl.prototype.render = function() {    
//     //     this.renderer.render(this.scene, this.camera);

//     //     this.someObject.rotation.y += 0.01;
//     //     this.someObject.rotation.x += 0.01;

//     //     this.someOtherObject.update();
//     // };

// })();




    function WebGL (){
        this.ms_Canvas = null;
        this.ms_Renderer = null;
        this.ms_Camera = null; 
        this.ms_Scene = null; 
        this.ms_Controls = null;
        this.ms_Water = null;
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

    WebGL.prototype.initialize = function (inIdCanvas) {
        this.ms_Canvas = $('#'+inIdCanvas);
        
        // Initialize Renderer, Camera and Scene
        this.ms_Renderer = this.enable? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        this.ms_Canvas.html(this.ms_Renderer.domElement);
        this.ms_Scene = new THREE.Scene();
        
        this.ms_Camera = new THREE.PerspectiveCamera(55.0, window.innerWidth / window.innerHeight, 0.5, 3000000);
        this.ms_Camera.position.set(1000, 500, -1500);
        this.ms_Camera.lookAt(new THREE.Vector3(0, 0, 0));
        
        // Initialize Orbit control     
        this.ms_Controls = new THREE.OrbitControls(this.ms_Camera, this.ms_Renderer.domElement);

        // Add light
        var directionalLight = new THREE.DirectionalLight(0xffff55, 1);
        directionalLight.position.set(-600, 300, 600);
        this.ms_Scene.add(directionalLight);
        
        // Load textures        
        var waterNormals = new THREE.ImageUtils.loadTexture('../assets/img/waternormals.jpg');
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 
        
        // Create the water effect
        this.ms_Water = new THREE.Water(this.ms_Renderer, this.ms_Camera, this.ms_Scene, {
            textureWidth: 256,
            textureHeight: 256,
            waterNormals: waterNormals,
            alpha:  1.0,
            sunDirection: directionalLight.position.normalize(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            betaVersion: 0,
            side: THREE.DoubleSide
        });
        var aMeshMirror = new THREE.Mesh(
            new THREE.PlaneGeometry(2000, 2000, 100, 100), 
            this.ms_Water.material
        );
        aMeshMirror.add(this.ms_Water);
        aMeshMirror.rotation.x = - Math.PI * 0.5;
        
        this.ms_Scene.add(aMeshMirror);

        this.loadSkyBox();
    };

    WebGL.prototype.loadSkyBox = function loadSkyBox() {
        var aCubeMap = THREE.ImageUtils.loadTextureCube([
          'assets/img/px.jpg',
          'assets/img/nx.jpg',
          'assets/img/py.jpg',
          'assets/img/ny.jpg',
          'assets/img/pz.jpg',
          'assets/img/nz.jpg'
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
        
        this.ms_Scene.add(aSkybox);
    };

    WebGL.prototype.display = function () {
        this.ms_Water.render();
        this.ms_Renderer.render(this.ms_Scene, this.ms_Camera);
    },

    WebGL.prototype.update = function () {
        this.ms_Water.material.uniforms.time.value += 1.0 / 60.0;
        this.ms_Controls.update();
        this.display();
    },

    WebGL.prototype.resize = function (inWidth, inHeight) {
        this.ms_Camera.aspect =  inWidth / inHeight;
        this.ms_Camera.updateProjectionMatrix();
        this.ms_Renderer.setSize(inWidth, inHeight);
        this.ms_Canvas.html(this.ms_Renderer.domElement);
        this.display();
    }





