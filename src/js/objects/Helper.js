var Helper = function () {
	
};

Helper.prototype.randomNumber = function (min, max) {
	return Math.random() * (max - min) + min;
}

Helper.prototype.getRandomDirection = function () {
    return (Math.round(this.randomNumber(1, 0)) ? 1 : -1);
}

Helper.prototype.getRandomAngle = function () {
	return this.randomNumber(0, Math.PI * 2);
}