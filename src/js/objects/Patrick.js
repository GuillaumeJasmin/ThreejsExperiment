var Patrick = (function (){

    /**
     * @constructor Patrick
     */
    function Patrick () {

        THREE.Object3D.call(this);

        var obj = modelsList['Patrick'].collada.scene.children[0].clone();
        
        obj.position.set(0, 35, 0);
        obj.scale.set(10, 10, 10);

        this.add(obj);

    }

    Patrick.prototype = new THREE.Object3D();
    Patrick.prototype.constructor = Patrick;

    _.merge(Patrick.prototype, MoveControl.prototype);

    return Patrick;

})();