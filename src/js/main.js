// var webgl, gui;

// $(document).ready(init);

// function init(){
//     webgl = new Webgl(window.innerWidth, window.innerHeight);
//     $('.three').append(webgl.renderer.domElement);

//     gui = new dat.GUI();
//     gui.close();

//     $(window).on('resize', resizeHandler);

//     animate();
// }

// function resizeHandler() {
//     webgl.resize(window.innerWidth, window.innerHeight);
// }

// function animate() {
//     requestAnimationFrame(animate);
//     webgl.render();
// }



var Webgl, gui
$(document).ready(init);


function init(){
	
	// var Webgl = new WebGL();


	Webgl = new WebGL(window.innerWidth, window.innerHeight);
    // $('.three').append(webgl.renderer.domElement);

    gui = new dat.GUI();
    gui.close();

    $(window).on('resize', resizeHandler);

	    
    var parameters = {
        alea: RAND_MT,
        generator: PN_GENERATOR,
        width: 2000,
        height: 2000,
        widthSegments: 250,
        heightSegments: 250,
        depth: 1500,
        param: 4,
        filterparam: 1,
        filter: [ CIRCLE_FILTER ],
        postgen: [ MOUNTAINS_COLORS ],
        effect: [ DESTRUCTURE_EFFECT ]
    };
    
    Webgl.initialize('canvas-3d', parameters);
    
    Webgl.resize(window.innerWidth, window.innerHeight);
    animate();


}

function resizeHandler() {
	Webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	Webgl.update();
}

