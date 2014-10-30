var MoveControl = (function(){    

    /**
     * @constructor MoveControl
     */
    function MoveControl () {

    };

    /**
     * @return void
     */
    MoveControl.prototype.startForward = function (event) {
        if(this.movingForward){
            return false;
        }

        this.movingForward = true;
    };

    /**
     * @return void
     */
    MoveControl.prototype.stopForward = function (event) {
        this.movingForward = false;
    };

    /**
     * @return void
     */
    MoveControl.prototype.startBackward = function (event) {
        if(this.movingBackward){
            return false;
        }

        this.movingBackward = true;
    };

    /**
     * @return void
     */
    MoveControl.prototype.stopBackward = function (event) {
        this.movingBackward = false;
    };


    /**
     * @return void
     */
    MoveControl.prototype.startRotationLeft = function (event) {
        if(this.rotatingLeft){
            return false;
        }

        this.rotatingLeft = true;
    };

    /**
     * @return void
     */
    MoveControl.prototype.stopRotationLeft = function (event) {
        this.rotatingLeft = false;
    };

    /**
     * @return void
     */
    MoveControl.prototype.startRotationRight = function (event) {
        if(this.rotatingRight){
            return false;
        }

        this.rotatingRight = true;
    };
    
    /**
     * @return void
     */
    MoveControl.prototype.stopRotationRight = function (event) {
        this.rotatingRight = false;
    };

    return MoveControl;

})();