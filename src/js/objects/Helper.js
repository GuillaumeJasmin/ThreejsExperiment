var Helper = function () {
	
};

Helper.prototype.randomNumber = function (min, max) {
	return Math.random() * (max - min) + min;
}