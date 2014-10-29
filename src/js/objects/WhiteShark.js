var WhiteShark = (function (){

    function WhiteShark (params) {

        THREE.Object3D.call(this);

        var obj = modelsList['WhiteShark'].collada.scene.children[0].clone();
        
        obj.position.set(0, -2, 0);
        obj.scale.set(1, 1, 1);

        var self = this;

        this.rotationX = 0;
        this.vit = 2;
        this.timeBeforeChangeDirection = this._getTimeBeforeChangeDirection();
        this.timeDuringChangeDirection = this._getTimeDuringChangeDirection();
        this.directionY = helper.getRandomDirection();

        if(params.randomPosition){
            this.position.set(helper.randomNumber(1000, -1000), 0, helper.randomNumber(1000, -1000));
        }
        else {
            this.position.set(params.position.x, params.position.y || 0, params.position.z);    
        }

        this.add(obj);

    }

    WhiteShark.prototype = new THREE.Object3D();
    WhiteShark.prototype.constructor = WhiteShark;

    /**
     * execute at each frame
     */
    WhiteShark.prototype.move = function () {

        if(this.isGoDown && this.rotation.x < 1){
            this.rotationX = +0.006;
        }
        else if(this.isGoUp && this.rotation.x < 1){
            this.rotationX = -0.006;
        }
        else {
            this.rotationX = 0;
        }


        if(this.position.y < -25){
            this.goUp();
        }

        if(this.position.y > -1){
            this.goDown();
        }

        this.changeDirection();

        // console.log(Math.round(helper.randomNumber(1, 0)));

        // saute
        // this.rotation.x += this.rotationX;
        
        this.translateZ(this.vit);
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
            this.rotation.y += helper.randomNumber(0.01, 0.005) * this.directionY;

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
    WhiteShark.prototype._getTimeBeforeChangeDirection = function () {
        return Math.round(helper.randomNumber(100, 300));
    }

    /**
     * @return int
     */
    WhiteShark.prototype._getTimeDuringChangeDirection = function () {
        return Math.round(helper.randomNumber(0, 300));
    }

    _.merge(WhiteShark.prototype, MoveControl.prototype);

    return WhiteShark;

})();
