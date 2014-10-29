var Barque = (function (){

	function Barque () {

		THREE.Object3D.call(this);

		var obj = JSONObj['Barque'].obj.clone();
		
		obj.position.set(0, 0, 0);
		obj.scale.set(5, 5, 5);

		this.add(obj);

	}

	Barque.prototype = new THREE.Object3D();
    Barque.prototype.constructor = Barque;

	_.merge(Barque.prototype, MoveControl.prototype);

	return Barque;

})();

