// http://guillaumegouessan.com/talk/move/
// http://guillaumegouessan.com/talk/workshop/

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