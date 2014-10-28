var Patrick = function () {
	
	this.collada = modelsList['Patrick'].obj; 
    this.obj = this.collada.scene.clone();

	this.obj.position.set(700, 35, 0);
    this.obj.scale.set(10, 10, 10);

    scene.add(this.obj);
}