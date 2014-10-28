var Radeau = function (params) {

    this.collada = modelsList['Radeau'].obj;
    this.obj = this.collada.scene.clone();
    this.obj.position.set(300, 0, -500);
    this.obj.scale.set(30, 30, 30);
    scene.add(this.obj);
}