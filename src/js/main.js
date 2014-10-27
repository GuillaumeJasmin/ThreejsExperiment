// http://guillaumegouessan.com/talk/move/
// http://guillaumegouessan.com/talk/workshop/
// http://3delyvisions.co/skf.htm
// http://tf3dm.com/
// http://stackoverflow.com/questions/11243689/prefered-3d-model-format-of-three-js

var webgl, gui;

$(document).ready(init);

function init(){
    webgl = new WebGL(window.innerWidth, window.innerHeight);
    webgl.initialize();
    $('.three').append(webgl.renderer.domElement);

    gui = new dat.GUI();
    gui.close();

    $(window).on('resize', resizeHandler);

    animate();
}

function resizeHandler() {
    webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    webgl.render();
}