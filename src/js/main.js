// http://guillaumegouessan.com/talk/move/
// http://guillaumegouessan.com/talk/workshop/
// http://3delyvisions.co/skf.htm
// http://tf3dm.com/
// http://stackoverflow.com/questions/11243689/prefered-3d-model-format-of-three-js
// http://quaintproject.wordpress.com/2014/01/25/exporting-from-blender-to-web-gl-using-collada-and-three-js-part-2/
// http://www.hongkiat.com/blog/60-excellent-free-3d-model-websites/



var webgl, gui, helper;

$(document).ready(init);

function init(){
    $('#bob').on('click', function (){
        $('.loading').removeClass('hidden');
        $('.choose-avatar').addClass('hidden');
        initWebGL('Bob');
    });

    $('#patrick').on('click', function (){
        $('.loading').removeClass('hidden');
        $('.choose-avatar').addClass('hidden');
        initWebGL('Patrick');
    });



}

function initWebGL(avatar){
    helper = new Helper();
    webgl = new WebGL({
        avatar: avatar
    });
    var onThreeReady = _.after(2, startAnimate);
    
    webgl.initialize({
        onModelsLoaded: onThreeReady
    });

    gui = new dat.GUI();
    gui.close();

    $(window).on('resize', resizeHandler);

    onThreeReady();
    
}

function startAnimate () {
    setTimeout(function () {
        $('.loading').addClass('hidden');
        $('.three').append(webgl.renderer.domElement);
        animate();
    }, 1000);
}

function resizeHandler() {
    webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    webgl.render();
}