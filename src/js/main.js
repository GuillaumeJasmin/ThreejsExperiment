// http://guillaumegouessan.com/talk/move/
// http://guillaumegouessan.com/talk/workshop/
// http://3delyvisions.co/skf.htm
// http://tf3dm.com/
// http://stackoverflow.com/questions/11243689/prefered-3d-model-format-of-three-js
// http://quaintproject.wordpress.com/2014/01/25/exporting-from-blender-to-web-gl-using-collada-and-three-js-part-2/
// http://www.hongkiat.com/blog/60-excellent-free-3d-model-websites/

var webgl, gui;

$(document).ready(init);

function init(){
    webgl = new WebGL(window.innerWidth, window.innerHeight);
    webgl.initialize();
    $('.three').append(webgl.renderer.domElement);

    gui = new dat.GUI();
    gui.close();

    $(window).on('resize', resizeHandler);

    setTimeout(function () {
        animate();
    }, 3000);
    
}

function resizeHandler() {
    webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    webgl.render();
}