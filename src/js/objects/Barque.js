var Barque = function (argument) {
    
	this.collada = modelsList['Barque'].obj; 
    this.obj = this.collada.scene.clone();

    this.obj.position.set(700, 0, 0);
    this.obj.scale.set(5,5,5);
    scene.add(this.obj);
}