var AircraftCarrier = function (params) {

        this.rotationX = 0;
        this.vit = 2;
        this.timeBeforeChangeDirection = this._getTimeBeforeChangeDirection();
        this.timeDuringChangeDirection = this._getTimeDuringChangeDirection();
        this.directionY = helper.getRandomDirection();

        this.obj = OBJList['AircraftCarrier'].obj.clone();
        this.obj.position.y = 1;

        scene.add(this.obj);
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


    this._changeDirection();

    // console.log(Math.round(helper.randomNumber(1, 0)));

    // saute
    // this.obj.rotation.x += this.rotationX;
    
    this.obj.translateZ(this.vit);
}


AircraftCarrier.prototype._changeDirection = function() {

    if(this.timeBeforeChangeDirection < 0){
    
        // rotating...    
        this.obj.rotation.y += helper.randomNumber(0.001, 0.005) * this.directionY;

        // stop rotation
        if(this.timeBeforeChangeDirection < -this.timeDuringChangeDirection){
            this.timeBeforeChangeDirection = this._getTimeBeforeChangeDirection();
            this.timeDuringChangeDirection = this._getTimeDuringChangeDirection();
            this.directionY = helper.getRandomDirection();
        }
    }

    this.timeBeforeChangeDirection -= 1;
    
};

AircraftCarrier.prototype._getTimeBeforeChangeDirection = function () {
    return Math.round(helper.randomNumber(300, 500));
}

AircraftCarrier.prototype._getTimeDuringChangeDirection = function () {
    return Math.round(helper.randomNumber(300, 600));
}

