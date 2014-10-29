// var Rondoudou = function () {
	
// 	this.collada = modelsList['Rondoudou'].obj; 
//     this.obj = this.collada.scene.clone();

// 	this.obj.position.set(0, 0.5, 1);
// 	this.obj.rotation.y = 3;
//     this.obj.scale.set(0.2, 0.2, 0.2);

//     // scene.add(this.obj);
//     //webgl.barque.add(this.obj);
// }



var Rondoudou = (function (){

	function Rondoudou () {

		THREE.Object3D.call(this);

		var obj = modelsList['Rondoudou'].collada.scene.children[0].clone();
		
		obj.position.set(0, 10, 0);
		obj.scale.set(10, 10, 10);

		this.add(obj);

	}

	Rondoudou.prototype = new THREE.Object3D();
    Rondoudou.prototype.constructor = Rondoudou;

	_.merge(Rondoudou.prototype, MoveControl.prototype);

	return Rondoudou;

})();

