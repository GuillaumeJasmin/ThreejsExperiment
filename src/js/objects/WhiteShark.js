var helper = new Helper();

var WhiteShark = function (params) {

    var self = this;

    this.rotationX = 0;
    this.vit = 2;
    this.timeBeforeChangeDirection = this._getTimeBeforeChangeDirection();
    this.timeDuringChangeDirection = this._getTimeDuringChangeDirection();
    this.directionY = this._getRandomDirection();
    
    if(!modelsList['WhiteShark'].obj){
        console.error('No collada for WhiteShark');
    }

    this.collada = modelsList['WhiteShark'].obj; 
    this.obj = this.collada.scene.clone();

    if(params.randomPosition){
        this.obj.position.set(helper.randomNumber(1000, -1000), 0, helper.randomNumber(1000, -1000));
    }
    else {
        this.obj.position.set(params.position.x, params.position.y || 0, params.position.z);    
    }
    
    this.obj.scale.set(10, 10, 10);
    scene.add(this.obj);
};

/**
 * execute at each frame
 */
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

    // console.log(Math.round(helper.randomNumber(1, 0)));

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

/**
 * check to change direction at each frame
 */
WhiteShark.prototype.changeDirection = function() {

    if(this.timeBeforeChangeDirection < 0){
    
        // rotating...    
        this.obj.rotation.y += helper.randomNumber(0.01, 0.005) * this.directionY;

        // stop rotation
        if(this.timeBeforeChangeDirection < -this.timeDuringChangeDirection){
            this.timeBeforeChangeDirection = this._getTimeBeforeChangeDirection();
            this.timeDuringChangeDirection = this._getTimeDuringChangeDirection();
            this.directionY = this._getRandomDirection();
        }
    }

    this.timeBeforeChangeDirection -= 1;
    
};

/**
 * @return int
 */
WhiteShark.prototype._getTimeBeforeChangeDirection = function () {
    return Math.round(helper.randomNumber(100, 300));
}

/**
 * @return int
 */
WhiteShark.prototype._getTimeDuringChangeDirection = function () {
    return Math.round(helper.randomNumber(0, 300));
}

/**
 * @return 1 or -1
 */
WhiteShark.prototype._getRandomDirection = function () {
    return (Math.round(helper.randomNumber(1, 0)) ? 1 : -1);
}



// WhiteShark.prototype.stabilization = function() {
//     if(this.obj.rotation.x > 0){
//         this.isGoUp = true;
//     }
// };

