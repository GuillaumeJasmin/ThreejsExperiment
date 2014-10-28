var Patrick = function () {
	
	this.collada = modelsList['Patrick'].obj; 
    this.obj = this.collada.scene.clone();

	this.obj.position.set(0, 7, 0);
    this.obj.scale.set(2, 2, 2);

    // scene.add(this.obj);
    //webgl.barque.add(this.obj);
}