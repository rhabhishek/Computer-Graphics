var gl;
var _NUM_POINTS = 5000;
var stops = new Array();
window.onload = function init(){
	
	var canvas = document.getElementById( "gl-canvas" );
        
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { 
		alert( "WebGL isn't available" );
	}
								
	// A triangle in the plane z= 0
	var vertices = new Array();
	vertices = [
		vec2( -1.0, -1.0 ),
		vec2(  0.0,  1.0 ),
		vec2(  1.0, -1.0 )
	];
	
	// An arbitrary initial point inside the triangle
	stops[0] = vec2(0.25, 0.50);
	// compute and store NumPoints-1 new points
	for(var k = 1; k < _NUM_POINTS; k++)
	{
		var point = new Array();
	var j = parseInt((Math.random()*10))%3; // pick a vertex at random
	
	// Compute the point halfway between selected
	// vertex and previous point
	point = midpoint(stops[k-1],vertices[j]);
	stops.push(vec2(point[0],point[1]));
	}
	
								//  Configure WebGL
 
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

				//  Load shaders and initialize attribute buffers

	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

				// Load the data into the GPU

	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(stops), gl.STATIC_DRAW );

				// Associate out shader variables with our data buffer

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );    

	render();
};

//render the data in the array buffer
function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.POINTS, 0, stops.length);
	gl.flush();
};

