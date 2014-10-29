var Radeau = function (params) {

    this.vit = 2;
    this.timeBeforeChangeDirection = this._getTimeBeforeChangeDirection();
    this.timeDuringChangeDirection = this._getTimeDuringChangeDirection();
    this.directionY = helper.getRandomDirection();

    this.collada = modelsList['Radeau'].obj;
    this.obj = this.collada.scene.clone();
    this.obj.position.set(300, 0, -500);
    this.obj.rotation.y = 3;
    this.obj.scale.set(30, 30, 30);
    scene.add(this.obj);
}

/**
 * execute at each frame
 */
Radeau.prototype.move = function () {

    this.changeDirection();

	// forward    
    this.obj.translateZ(this.vit);
}



/**
 * check to change direction at each frame
 */
Radeau.prototype.changeDirection = function() {

    if(this.timeBeforeChangeDirection < 0){
    
        // rotating...    
        this.obj.rotation.y += helper.randomNumber(0.01, 0.005) * this.directionY;

        // stop rotation
        if(this.timeBeforeChangeDirection < -this.timeDuringChangeDirection){
            this.timeBeforeChangeDirection = this._getTimeBeforeChangeDirection();
            this.timeDuringChangeDirection = this._getTimeDuringChangeDirection();
            this.directionY = helper.getRandomDirection();
        }
    }

    this.timeBeforeChangeDirection -= 1;
    
};

/**
 * @return int
 */
Radeau.prototype._getTimeBeforeChangeDirection = function () {
    return Math.round(helper.randomNumber(100, 300));
}

/**
 * @return int
 */
Radeau.prototype._getTimeDuringChangeDirection = function () {
    return Math.round(helper.randomNumber(0, 300));
}
