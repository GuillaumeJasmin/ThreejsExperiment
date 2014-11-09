var Radeau = (function (){

	/**
     * @constructor Radeau
     */
	function Radeau () {

		THREE.Object3D.call(this);

		var obj = modelsList['Radeau'].collada.scene.children[0].clone();

		obj.position.set(0, 0, 0);
		obj.scale.set(0.4, 0.4, 0.4);

		this.add(obj);

		this.vit = 2;
	    this.timeBeforeChangeDirection = this._getTimeBeforeChangeDirection();
	    this.timeDuringChangeDirection = this._getTimeDuringChangeDirection();
	    this.directionY = helper.getRandomDirection();

	}

	Radeau.prototype = new THREE.Object3D();
    Radeau.prototype.constructor = Radeau;

	_.merge(Radeau.prototype, MoveControl.prototype);

	/**
	 * execute at render
	 */
	Radeau.prototype.move = function () {

		// random rotation
	    this.changeDirection();

		// forward
	    this.translateZ(this.vit);
	}

	/**
	 * check to change direction at each frame
	 */
	Radeau.prototype.changeDirection = function() {

	    if(this.timeBeforeChangeDirection < 0){

	        // rotating...
	        this.rotation.y += helper.randomNumber(0.01, 0.0005) * this.directionY;

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

	return Radeau;

})();
