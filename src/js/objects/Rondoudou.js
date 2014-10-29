var Rondoudou = function () {
	
	this.collada = modelsList['Rondoudou'].obj; 
    this.obj = this.collada.scene.clone();

	this.obj.position.set(0, 0.5, 1);
	this.obj.rotation.y = 3;
    this.obj.scale.set(0.2, 0.2, 0.2);

    // scene.add(this.obj);
    //webgl.barque.add(this.obj);
}



