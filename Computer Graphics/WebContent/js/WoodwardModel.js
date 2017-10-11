var gl;
var points=[];
var colors=[];
var theta  = 0.0;
var phi    = 0.0;
var radius = 1.0;
var LEFT = -1500, RIGHT = 1500, BOTTOM = -1500, TOP = 1500, NEAR = 1500, FAR = -1500;
var at = vec3(0.25, -0.25, 0);
var up = vec3(0.1, 0.0, 0.0);
var eye = vec3(radius*Math.sin(theta)*Math.cos(phi), radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
window.onload = function init() {
	var canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
	}
	// Four Vertices
	
	
	 vertices = [	
	             	vec4(0, 0, 0, 1.0),
	             	vec4(0, 10.0, 0.0, 1.0),
	             	vec4(-25.0, 10.0, 0, 1.0),
	             	vec4(-25.0, 0, 0, 1.0),
	             	vec4(-25.0, 0, -10, 1.0),
	             	vec4(0, 0, -10.0, 1.0),
	             	vec4(0, 10.0, -10.0, 1.0),
	             	vec4(-25.0, 10.0, -10.0, 1.0)
					];

	


	 vertexColors = [ 		[ 0.0, 0.0, 0.0, 1.0 ], // black
							[ 1.0, 0.0, 0.0, 1.0 ], // red
							[ 1.0, 1.0, 0.0, 1.0 ], // yellow
							[ 0.0, 1.0, 0.0, 1.0 ], // green
							[ 0.0, 0.0, 1.0, 1.0 ], // blue
							[ 1.0, 0.0, 1.0, 1.0 ], // magenta
							[ 1.0, 1.0, 1.0, 1.0 ], // white
							[ 0.0, 1.0, 1.0, 1.0 ] // cyan
							];

	 

	colorCube();
	
	
	
	//  Configure WebGL

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	
	gl.enable(gl.DEPTH_TEST);
	
	//  Load shaders and initialize attribute buffers

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// Load the data into the GPU
	
	// Associate out shader variables with our data buffer
	   
	
	//color buffer
	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation( program, "vColor" );
		gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vColor );

		//vertex buffer
	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
	
	  var vPosition = gl.getAttribLocation( program, "vPosition" );
	    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	    gl.enableVertexAttribArray( vPosition );
	    
	    
	    
	     modelViewMatrixLoc = gl.getUniformLocation(program,"model");
	     projectionRef =  gl.getUniformLocation(program,"projection");

	    render();
	    
	    
	    
};

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	renderBlock();

	requestAnimFrame(render);
}
function renderBlock(){
	
	 var projection = mult(ortho(LEFT, RIGHT, BOTTOM, TOP, NEAR, FAR), lookAt(eye, at, up));
		//left block floor1
	ctm = mat4();
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
	  gl.uniformMatrix4fv(projectionRef,  false, flatten(projection));
	gl.drawArrays(gl.TRIANGLES, 0, points.length);
}
function quad(a, b, c, d) {
	var array = [ a, b, c, a, c, d ];
	//var color=[0.8,0.8,0.8,0.9];
	for (var i = 0; i < array.length; ++i) {
		points.push(vertices[array[i]]);
		colors.push(vertexColors[i]);
	}
}

function colorCube() {
	quad(1, 0, 3, 2);
	quad(2, 3, 7, 6);
	quad(3, 0, 4, 7);
	quad(6, 5, 1, 2);
	quad(4, 5, 6, 7);
	quad(5, 4, 0, 1);
}

function generateCylinder(cx,cy){
	var cylinder=[];
	for(var i=0;i<=360;i=i+30){
	var x = cx + 50 * cos(i);
	var y = cy + 50 * sin(i);
	cylinder.push(vec4(x,0,y));
	}
	return cylinder;
}