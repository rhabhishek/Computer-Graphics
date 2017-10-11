var gl;
var numVertices = 36;
var points = [];
var colors = [];
var vertices;
var vertexColors;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 1;
var theta = [0, 0, 0];
var modelViewMatrixLoc;
var xLoc,yLoc,zLoc,zoomLoc;
var x=1.0, y=0.0, z=0.0, zoom=1.0;
window.onload = function init() {
	var canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
	}
	// Four Vertices
	
	var indices = [	1, 0, 3,
					3, 2, 1,
					2, 3, 7,
					7, 6, 2,
					3, 0, 4,
					4, 7, 3,
					6, 5, 1,
					1, 2, 6,
					4, 5, 6,
					6, 7, 4,
					5, 4, 0,
					0, 1, 5
					];
	
	 vertices = [	vec4(-0.5, -0.5, 0.5, 1.0),
	             	vec4(-0.5, 0.5, 0.5, 1.0),
	             	vec4(0.5, 0.5, 0.5, 1.0),
	             	vec4(0.5, -0.5, 0.5, 1.0),
	             	vec4(-0.5, -0.5, -0.5, 1.0),
	             	vec4(-0.5, 0.5, -0.5, 1.0),
	             	vec4(0.5, 0.5, -0.5, 1.0),
	             	vec4(0.5, -0.5, -0.5, 1.0)
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
	   
    //index buffer
    var iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices),
			gl.STATIC_DRAW);
	
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
	    
	    
	    
	     modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix");

		    xLoc = gl.getUniformLocation(program,"x");
		     yLoc = gl.getUniformLocation(program,"y");
		     zLoc = gl.getUniformLocation(program,"z");
		     zoomLoc = gl.getUniformLocation(program,"zoom");
	     
	    /*modelViewMatrix = mat4();
	    modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis],[1,0,0]));
	    modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis],[0,1,0]));
	    modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis],[0,0,1]));*/
	    
	    render();
	    
	    
	    
};

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	theta[xAxis] += 2.0;
	theta[yAxis] += 2.0;
	theta[zAxis] += 2.0;
	
	/*******Row 1 starts*******/
	//cube 1
	ctm = mat4();
	ctm = mult(ctm, rotate(theta[xAxis],[1,0,0]));
	
	gl.uniform1f(xLoc, x-3.0);
	gl.uniform1f(yLoc, y+3.0);
	gl.uniform1f(zLoc,z);
	gl.uniform1f(zoomLoc, zoom+3);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
	
	//cube 2
	ctm = mat4();
	ctm = mult(ctm, rotate(theta[xAxis],[1,0,0]));
	ctm = mult(ctm, rotate(theta[yAxis],[0,1,0]));
	
	gl.uniform1f(xLoc, x+0.0);
	gl.uniform1f(yLoc, y+3.0);
	gl.uniform1f(zLoc,z);
	gl.uniform1f(zoomLoc, zoom+3);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
	
	//cube 3
	ctm = mat4();
	ctm = mult(ctm, rotate(theta[xAxis],[1,0,0]));
	ctm = mult(ctm, rotate(theta[zAxis],[0,0,1]));
	
	gl.uniform1f(xLoc, x+3.0);
	gl.uniform1f(yLoc, y+3.0);
	gl.uniform1f(zLoc,z);
	gl.uniform1f(zoomLoc, zoom+3);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
	
	/*******Row 2 starts*******/
	//cube 4
	ctm = mat4();
	ctm = mult(ctm, rotate(-theta[xAxis],[1,0,0]));
	ctm = mult(ctm, rotate(-theta[yAxis],[0,1,0]));
	
	gl.uniform1f(xLoc, x-3.0);
	gl.uniform1f(yLoc, y);
	gl.uniform1f(zLoc,z);
	gl.uniform1f(zoomLoc, zoom+3);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
	
	//cube 5
	ctm = mat4();
	ctm = mult(ctm, rotate(theta[yAxis],[0,1,0]));
	
	gl.uniform1f(xLoc, x);
	gl.uniform1f(yLoc, y);
	gl.uniform1f(zLoc,z);
	gl.uniform1f(zoomLoc, zoom+3);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
	
	//cube 6
	ctm = mat4();
	ctm = mult(ctm, rotate(theta[yAxis],[0,1,0]));
	ctm = mult(ctm, rotate(theta[zAxis],[0,0,1]));
	
	gl.uniform1f(xLoc, x+3.0);
	gl.uniform1f(yLoc, y);
	gl.uniform1f(zLoc,z);
	gl.uniform1f(zoomLoc, zoom+3);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
	
	
	/*******Row 3 starts*******/
	//cube 7
	ctm = mat4();
	ctm = mult(ctm, rotate(theta[-xAxis],[1,0,0]));
	ctm = mult(ctm, rotate(-theta[zAxis],[0,0,1]));
	
	gl.uniform1f(xLoc, x-3.0);
	gl.uniform1f(yLoc, y-3.0);
	gl.uniform1f(zLoc,z);
	gl.uniform1f(zoomLoc, zoom+3);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
	
	//cube 8
	ctm = mat4();
	ctm = mult(ctm, rotate(-theta[yAxis],[0,1,0]));
	ctm = mult(ctm, rotate(-theta[zAxis],[0,0,1]));
	
	gl.uniform1f(xLoc, x);
	gl.uniform1f(yLoc, y-3.0);
	gl.uniform1f(zLoc,z);
	gl.uniform1f(zoomLoc, zoom+3);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
	
	//cube 9
	ctm = mat4();
	ctm = mult(ctm, rotate(theta[zAxis],[0,0,1]));
	
	gl.uniform1f(xLoc, x+3.0);
	gl.uniform1f(yLoc, y-3.0);
	gl.uniform1f(zLoc,z);
	gl.uniform1f(zoomLoc, zoom+3);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
	
	requestAnimFrame(render);
}

function quad(a, b, c, d) {
	var array = [ a, b, c, a, c, d ];
	for (var i = 0; i < array.length; ++i) {
		points.push(vertices[array[i]]);
		colors.push(vertexColors[array[i]]);
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