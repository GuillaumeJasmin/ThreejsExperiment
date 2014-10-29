var MoveControl = (function(){    

    function MoveControl () {

    };

    MoveControl.prototype.startForward = function (event) {
        if(this.movingForward){
            return false;
        }

        this.movingForward = true;
    };

    MoveControl.prototype.stopForward = function (event) {
        this.movingForward = false;
    };

    MoveControl.prototype.startBackward = function (event) {
        if(this.movingBackward){
            return false;
        }

        this.movingBackward = true;
    };

    MoveControl.prototype.stopBackward = function (event) {
        this.movingBackward = false;
    };


    MoveControl.prototype.startRotationLeft = function (event) {
        if(this.rotatingLeft){
            return false;
        }

        this.rotatingLeft = true;
    };

    MoveControl.prototype.stopRotationLeft = function (event) {
        this.rotatingLeft = false;
    };

    MoveControl.prototype.startRotationRight = function (event) {
        if(this.rotatingRight){
            return false;
        }

        this.rotatingRight = true;
    };

    MoveControl.prototype.stopRotationRight = function (event) {
        this.rotatingRight = false;
    };

    return MoveControl;

})();