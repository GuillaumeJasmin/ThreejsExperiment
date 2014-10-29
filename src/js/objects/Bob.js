var Bob = (function (){

	function Bob () {

		THREE.Object3D.call(this);

		var obj = JSONObj['Bob'].obj.clone();
		
		obj.position.set(0, 0, 0);
		obj.scale.set(7, 7, 7);

		this.add(obj);

	}

	Bob.prototype = new THREE.Object3D();
    Bob.prototype.constructor = Bob;

	//_.merge(Bob.prototype, MoveControl.prototype);

	return Bob;

})();