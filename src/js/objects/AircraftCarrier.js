var AircraftCarrier = function (params) {

        this.rotationX = 0;
        this.vit = 2;
        this.timeBeforeChangeDirection = this._getTimeBeforeChangeDirection();
        this.timeDuringChangeDirection = this._getTimeDuringChangeDirection();
        this.directionY = this._getRandomDirection();

        // this.obj = {};

        var self = this;

        // var manager = new THREE.LoadingManager();
        // manager.onProgress = function ( item, loaded, total ) {
        //     console.log( item, loaded, total );
        // };

        // var texture = new THREE.Texture();
        // var onProgress = function ( xhr ) {
        //     if ( xhr.lengthComputable ) {
        //         var percentComplete = xhr.loaded / xhr.total * 100;
        //         console.log( Math.round(percentComplete, 2) + '% downloaded' );
        //     }
        // };

        // var onError = function ( xhr ) {};

        // var loader = new THREE.ImageLoader( manager );
        // loader.load('assets/models/Aircraft/Acft Carrier Top.jpg', function ( image ) {
        //     texture.image = image;
        //     texture.needsUpdate = true;
        // });

        // var loader = new THREE.OBJLoader( manager );
        // loader.load('assets/models/Aircraft/Aircraft Carrier.obj', function ( object ) {

        //     self.obj = object;

        //     self.obj.traverse( function ( child ) {
        //         if ( child instanceof THREE.Mesh ) {
        //             child.material.map = texture;
        //         }
        //     });

        //     self.obj.position.y = 1;
        //     scene.add(self.obj);

        // }, onProgress, onError );

        // this.collada = modelsList['WhiteShark'].obj; 
        // this.obj = this.collada.scene.clone();

        this.obj = OBJList['AircraftCarrier'].obj.clone();
        this.obj.position.y = 1;

        scene.add(self.obj);

}

AircraftCarrier.prototype.move = function () {

    if(this.isGoDown && this.obj.rotation.x < 1){
        this.rotationX = +0.006;
    }
    else if(this.isGoUp && this.obj.rotation.x < 1){
        this.rotationX = -0.006;
    }
    else {
        this.rotationX = 0;
    }


    this.changeDirection();

    // console.log(Math.round(randomNumber(1, 0)));

    // saute
    // this.obj.rotation.x += this.rotationX;
    
    this.obj.translateZ(this.vit);
}


AircraftCarrier.prototype.changeDirection = function() {

    if(this.timeBeforeChangeDirection < 0){
    
        // rotating...    
        this.obj.rotation.y += randomNumber(0.001, 0.005) * this.directionY;

        // stop rotation
        if(this.timeBeforeChangeDirection < -this.timeDuringChangeDirection){
            this.timeBeforeChangeDirection = this._getTimeBeforeChangeDirection();
            this.timeDuringChangeDirection = this._getTimeDuringChangeDirection();
            this.directionY = this._getRandomDirection();
        }
    }

    this.timeBeforeChangeDirection -= 1;
    
};

AircraftCarrier.prototype._getTimeBeforeChangeDirection = function () {
    return Math.round(randomNumber(300, 500));
}

AircraftCarrier.prototype._getTimeDuringChangeDirection = function () {
    return Math.round(randomNumber(300, 600));
}

/**
 * @return 1 or -1
 */
AircraftCarrier.prototype._getRandomDirection = function () {
    return (Math.round(randomNumber(1, 0)) ? 1 : -1);
}



// AircraftCarrier.prototype.stabilization = function() {
//     if(this.obj.rotation.x > 0){
//         this.isGoUp = true;
//     }
// };

function randomNumber (min, max) {
    return Math.random() * (max - min) + min;
};



