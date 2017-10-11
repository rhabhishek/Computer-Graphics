var gl;
var modelViewMatrixLoc;
var cylinder=[];//[[50, 0], [43.3012, 24.9999], [25.0000, 43.3012], [3.0616, 50], [-24.9999, 43.3012], [-43.3012, 24.9999], [-50, 6.1232], [-43.3012, -25.0000], [-25.0000, -43.3012], [-9.1848, -50], [25.0000, -43.3012], [43.3012, -25.0000]];
window.onload = function init() {
	var canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
	}
	
	//  Configure WebGL

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	
	gl.enable(gl.DEPTH_TEST);
	
	//  Load shaders and initialize attribute buffers

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// Load the data into the GPU
	
	//var cube = mat4(vertices);
	cylinder = generateCylinder(0,0);
	
	    
	  //vertex buffer
		var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(cylinder), gl.STATIC_DRAW);
		
		  var vPosition = gl.getAttribLocation( program, "vPosition" );
		    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
		    gl.enableVertexAttribArray( vPosition );
		     modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix");
		     
	    render();
	    
	    
	    
};

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	ctm = mat4();
	ctm = mult(ctm, rotate(1,[1,0,0]));
	ctm = add(ctm,mat4(vec4(0,0,0,0),vec4(0,0,0,-50),vec4(0,0,0,0),vec4(0,0,0,200.0)));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
	gl.drawArrays(gl.TRIANGLE_FAN, 0, cylinder.length);
	ctm = mat4();
	
	ctm = add(ctm,mat4(vec4(0,0,0,0),vec4(0,0,0,50),vec4(0,0,0,0),vec4(0,0,0,200.0)));
	ctm = mult(ctm, rotate(1,[1,0,0]));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
	gl.drawArrays(gl.TRIANGLE_FAN, 0, cylinder.length);
//	requestAnimFrame(render);
}


function generateCylinder(cx,cy){
	var cylinder=[];
	for(var i=0;i<=360;i=i+10){
		var x = cx + parseFloat((50 * Math.cos(i* Math.PI/180.0)).toFixed(4));
		var y = cy + parseFloat((50 * Math.sin(i* Math.PI/180.0)).toFixed(4));
		cylinder.push(vec4(x,0,y,1.0));
	}
	return cylinder;
}