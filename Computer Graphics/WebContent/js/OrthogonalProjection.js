var gl;
var numVertices = 36;
var points = [];
var colors = [];
var vertices;
var vertexColors;
var modelViewMatrixLoc;
var projectionLoc;
var modelMatrix,projMatrix;
var eye;
var near = -1;
var far = 1;
var radius = 1.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

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
	
	var cube = mat4(vertices);
	
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
	     projectionLoc = gl.getUniformLocation(program,"projection");
	     
	     
	     
	     
	     document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1;};
	     document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;};
	     document.getElementById("Button3").onclick = function(){radius *= 1.1;};
	     document.getElementById("Button4").onclick = function(){radius *= 0.9;};
	     document.getElementById("Button5").onclick = function(){theta += dr;};
	     document.getElementById("Button6").onclick = function(){theta -= dr;};
	     document.getElementById("Button7").onclick = function(){phi += dr;};
	     document.getElementById("Button8").onclick = function(){phi -= dr;};
	     
	     
	     
	     
	    
	    render();
	    
	    
	    
};

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	eye = vec3(radius*Math.sin(phi), radius*Math.sin(theta), 
            radius*Math.cos(phi));

       modelMatrix = lookAt(eye, at , up); 
       projMatrix = ortho(left, right, bottom, ytop, near, far);
       
       gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelMatrix) );
       gl.uniformMatrix4fv( projectionLoc, false, flatten(projMatrix) );
	
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);

	requestAnimFrame(render);
}

function quad(a, b, c, d) {
	var array = [ a, b, c, a, c, d ];
	for (var i = 0; i < array.length; ++i) {
		points.push(vertices[array[i]]);
		colors.push(vertexColors[a]);
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