var gl;
var _NUM_DIVISIONS_ = 8;
var _NUM_VERTICES_ = Math.pow(3,_NUM_DIVISIONS_)+1;
var points = new Array();
var index = 0;

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
	divide_triangle(vertices[0], vertices[1], vertices[2],_NUM_DIVISIONS_);
	
								//  Configure WebGL
 
	gl.viewport( canvas.width/4, canvas.height/4, canvas.width, canvas.height );
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

				//  Load shaders and initialize attribute buffers

	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

				// Load the data into the GPU

	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

				// Associate out shader variables with our data buffer

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );    

	render();
};

// render the data in the array buffer
function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.TRIANGLES, 0, _NUM_VERTICES_);
	gl.flush();
};

function divide_triangle(a,b,c,count){
	if(count > 0)
	{
	// compute midpoints of sides
	var ab = midpoint(a,b);
	var ac = midpoint(a,c);
	var bc = midpoint(b,c);
	// subdivide all but inner triangle
	divide_triangle(a, ab, ac, count-1);
	divide_triangle(c, ac, bc, count-1);
	divide_triangle(b, bc, ab, count-1);
	}
	else triangle(a,b,c); /* draw triangle at end of recursion */
}

function triangle(a,b,c)
/* specify one triangle */
{
points[index] = a;
index++;
points[index] = b;
index++;
points[index] = c;
index++;
}
