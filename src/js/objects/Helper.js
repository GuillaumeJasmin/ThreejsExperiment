/**
 * @constructor Barque
 */
var Helper = function () {
	
};

/**
 * @return Number, int or float
 */
Helper.prototype.randomNumber = function (min, max) {
	return Math.random() * (max - min) + min;
}

/**
 * @return 1 or -1
 * Used for direction rotation
 */
Helper.prototype.getRandomDirection = function () {
    return (Math.round(this.randomNumber(1, 0)) ? 1 : -1);
}

/**
 * @return float
 * radian
 */
Helper.prototype.getRandomAngle = function () {
	return this.randomNumber(0, Math.PI * 2);
}