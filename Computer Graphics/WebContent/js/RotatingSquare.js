var gl;
var points;
var theta = 0.0;
var thetaLoc = 0.0;
var increment = 0.1;
var speed = 100;
var MAX_SPEED = 10;
var MIN_SPEED = 1000;
window.onload = function init(){
	var canvas = document.getElementById( "gl-canvas" );
        
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { 
		alert( "WebGL isn't available" );
	}
								// Four Vertices

	var vertices = [
		vec2( -0.5, -0.5 ),
		vec2(  -0.5,  0.5 ),
		vec2(  0.5, 0.5 ),
		vec2( 0.5, -0.5)
	];

								//  Configure WebGL
 
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

				//  Load shaders and initialize attribute buffers

	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

				// Load the data into the GPU

	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

				// Associate out shader variables with our data buffer

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );    

	// create event listeners
	var mouse_down = false;
	canvas.addEventListener('mousedown',  
		function(evt) {
			mouse_down = true;
		}
	);
	canvas.addEventListener('mouseup',  
		function(evt) {
			mouse_down = false;
		}
	);
	canvas.addEventListener('mousemove', 
		function(evt) {
			if (mouse_down)
				mouseAccelerator(evt, gl, canvas, program, vPosition, bufferId);
		}
	);
	
	window.addEventListener("keydown", function(event) {
		switch (event.keyCode) {
		case 49: // ’1’ key
			increment = (increment > 0)? -0.1:0.1;
			break;
		case 50: // ’2’ key
			speed /= 2.0;
			break;
		case 51: // ’3’ key
			speed *= 2.0;
			break;
		}
		});
	
	thetaLoc = gl.getUniformLocation(program, "theta");
	
	render();
};

function render() {
	setTimeout(function() {
		requestAnimFrame(render);
	gl.clear( gl.COLOR_BUFFER_BIT );
	theta += increment;
	gl.uniform1f(thetaLoc, theta);
	gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
	}, speed);
}

function changeDirection(){
	increment = (increment > 0)? -0.1:0.1;
}

function increaseSpeed(){
	if(speed > MAX_SPEED){
	speed/=2;
	}
}

function decreaseSpeed(){
	if(speed < MIN_SPEED){
	speed*=2;
	}
}

function reset(){
	speed = 100;
	increment = 0.1;
}

function changeSpeed(value){
	speed = 100-value;
}

function mouseAccelerator(evt, gl, canvas, program, vPosition, bufferId){
	var x = evt.clientX;
	var y = evt.clientY;
                        // scale to NDC (-1, 1 in X and Y)
	var points = 
		[ 	-1. + x*2.0/canvas.width , 
			-1. + (canvas.height-y)*2.0/canvas.height ];

	increment+=  points[0]/100;
	console.log(increment);
	
}


