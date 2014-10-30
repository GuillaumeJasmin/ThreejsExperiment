
var Rondoudou = (function (){

    /**
     * @constructor Rondoudou
     */
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

