var WhiteShark = function (params) {

    var self = this;

    this.rotationX = 0;
    this.vit = 2;
    this.timeBeforeChangeDirection = this._getTimeBeforeChangeDirection();
    this.timeDuringChangeDirection = this._getTimeDuringChangeDirection();
    this.directionY = this._getRandomDirection();

    // this.obj = {};

    // var loader = new THREE.ColladaLoader();
    // loader.options.convertUpAxis = true;
    // loader.load('assets/models/whiteShark.dae', function ( collada ) {
    //     self.obj = collada.scene;
    //     var skin = collada.skins[0];
    //     if(params.randomPosition){
    //         self.obj.position.set(randomNumber(1000, -1000), 0, randomNumber(1000, -1000));
    //     }
    //     else {
    //         self.obj.position.set(params.position.x, params.position.y || 0, params.position.z);    
    //     }
        
    //     self.obj.scale.set(10, 10, 10);
    //     scene.add(self.obj);
    // });
    

    if(!modelsList['WhiteShark'].obj){
        console.error('No collada for WhiteShark');
    }

    self.obj = modelsList['WhiteShark'].obj.clone();

    if(params.randomPosition){
        self.obj.position.set(randomNumber(1000, -1000), 0, randomNumber(1000, -1000));
    }
    else {
        self.obj.position.set(params.position.x, params.position.y || 0, params.position.z);    
    }
    
    self.obj.scale.set(10, 10, 10);
    scene.add(self.obj);

    
};

WhiteShark.prototype.move = function () {

    if(this.isGoDown && this.obj.rotation.x < 1){
        this.rotationX = +0.006;
    }
    else if(this.isGoUp && this.obj.rotation.x < 1){
        this.rotationX = -0.006;
    }
    else {
        this.rotationX = 0;
    }


    if(this.obj.position.y < -25){
        this.goUp();
    }

    if(this.obj.position.y > -1){
        this.goDown();
    }

    this.changeDirection();

    // console.log(Math.round(randomNumber(1, 0)));

    // saute
    // this.obj.rotation.x += this.rotationX;
    
    this.obj.translateZ(this.vit);
}

WhiteShark.prototype.goDown = function() {
    this.isGoDown = true;
    this.isGoUp   = false;
};

WhiteShark.prototype.goUp = function() {
    this.isGoUp   = true;
    this.isGoDown = false;
};

WhiteShark.prototype.changeDirection = function() {

    if(this.timeBeforeChangeDirection < 0){
    
        // rotating...    
        this.obj.rotation.y += randomNumber(0.01, 0.005) * this.directionY;

        // stop rotation
        if(this.timeBeforeChangeDirection < -this.timeDuringChangeDirection){
            this.timeBeforeChangeDirection = this._getTimeBeforeChangeDirection();
            this.timeDuringChangeDirection = this._getTimeDuringChangeDirection();
            this.directionY = this._getRandomDirection();
        }
    }

    this.timeBeforeChangeDirection -= 1;
    
};

WhiteShark.prototype._getTimeBeforeChangeDirection = function () {
    return Math.round(randomNumber(100, 300));
}

WhiteShark.prototype._getTimeDuringChangeDirection = function () {
    return Math.round(randomNumber(0, 300));
}

/**
 * @return 1 or -1
 */
WhiteShark.prototype._getRandomDirection = function () {
    return (Math.round(randomNumber(1, 0)) ? 1 : -1);
}



// WhiteShark.prototype.stabilization = function() {
//     if(this.obj.rotation.x > 0){
//         this.isGoUp = true;
//     }
// };

function randomNumber (min, max) {
    return Math.random() * (max - min) + min;
};


function cloneObj(obj) {
    var clone = {};

    for (var i in obj) {
        
        if (obj[i] && typeof obj[i] == 'object') {
            if (obj[i].hasOwnProperty(i)) {
                clone[i] = cloneObj(obj[i]);
            }
        } else {
            clone[i] = obj[i];
        }

    }

    return clone;
}

