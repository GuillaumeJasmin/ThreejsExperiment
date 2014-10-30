var ModelsLoader = (function(){    

    function ModelsLoader () {

    };

    /**
     * @return void
     * load .dae model
     */
    ModelsLoader.prototype.loadModels = function () {

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
            // console.log( item, loaded, total );
        };

        this.OBJLoaderOnProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                // console.log( Math.round(percentComplete, 2) + '% downloaded' );
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
    ModelsLoader.prototype.loadColladaModel = function (modelName) {
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
    ModelsLoader.prototype.loadOBJModel = function (modelName) {
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
    ModelsLoader.prototype.loadJSONModel = function (modelName) {
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


    return ModelsLoader;

})();