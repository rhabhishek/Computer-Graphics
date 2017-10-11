
var canvas;
var gl;

var numVertices  = 36;

var texSize = 256;
var numChecks = 8;

var program;

var texture1, texture2 , texture3 , texture4 , texture5 , texture6 ,texture7;
var t1, t2;

var c;
var renderType = 1;
var flag = true;


var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texCoord = [
	vec2(0, 0),
	vec2(0, 1),
	vec2(1, 1),
	vec2(1, 0)
];




var modelMatLoc;
var texCoord2 = [
	// Front face
	0.0, 0.0,
	1.0, 0.0,
	1.0, 1.0,
	0.0, 1.0,

	1.0, 0.0,
	1.0, 1.0,
	0.0, 1.0,
	0.0, 0.0,

];
var indices = [
	1, 0, 3,
	3, 2, 1,

];

var vertices = [
	vec4( -0.5, -0.5,  0.5, 1.0 ),
	vec4( -0.5,  0.5,  0.5, 1.0 ),
	vec4( 0.5,  0.5,  0.5, 1.0 ),
	vec4( 0.5, -0.5,  0.5, 1.0 ),

];

var vertexColors = [
	vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
	vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
	vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
	vec4( 0.0, 1.0, 0.0, 1.0 ),  // green

];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;

var theta = [45.0, 45.0, 45.0];

var thetaLoc;
var img1 ;
var img2 ;
var img3 ;
var img4;
var img5;
var img6;
var img7;
var renderTypeLoc;
function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

function setupTextureFilteringAndMips(width, height) {
	if (isPowerOf2(width) && isPowerOf2(height) ){
		// the dimensions are power of 2 so generate mips and turn on
		// tri-linear filtering.
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	} else {
		// at least one of the dimensions is not a power of 2 so set the filtering
		// so WebGL will render it.
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	}
}

function configureTexture() {


	texture1 = gl.createTexture();

	gl.bindTexture( gl.TEXTURE_2D, texture1 );
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
		new Uint8Array([0, 0, 255, 255]));

	img1 = new Image()
	img1.src = "texture1.jpeg";
	img1.addEventListener('load', function() {
		// Now that the image has loaded make copy it to the texture.
		gl.bindTexture(gl.TEXTURE_2D, texture1);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, img1);
		setupTextureFilteringAndMips(img1.width, img1.height);
	});

	texture2 = gl.createTexture();

	gl.bindTexture( gl.TEXTURE_2D, texture2);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
		new Uint8Array([0, 0, 255, 255]));

	img2 = new Image()
	img2.src = "texture2.png";//"checkered.jpg";
	img2.addEventListener('load', function() {
		// Now that the image has loaded make copy it to the texture.
		gl.bindTexture(gl.TEXTURE_2D, texture2);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, img2);
		//gl.generateMipmap(gl.TEXTURE_2D);
		setupTextureFilteringAndMips(img2.width, img2.height);
	});
	texture3 = gl.createTexture();

	gl.bindTexture( gl.TEXTURE_2D, texture3 );
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
		new Uint8Array([0, 0, 255, 255]));

	img3 = new Image()
	img3.src = "texture3.png";//"checkered.jpg";
	img3.addEventListener('load', function() {
		// Now that the image has loaded make copy it to the texture.
		gl.bindTexture(gl.TEXTURE_2D, texture3);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, img3);
		//gl.generateMipmap(gl.TEXTURE_2D);
		setupTextureFilteringAndMips(img3.width, img3.height);
	});
	texture4 = gl.createTexture();

	gl.bindTexture( gl.TEXTURE_2D, texture4 );
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
		new Uint8Array([0, 0, 255, 255]));

	img4 = new Image()
	img4.src = "texture4.jpg";//"checkered.jpg";
	img4.addEventListener('load', function() {
		// Now that the image has loaded make copy it to the texture.
		gl.bindTexture(gl.TEXTURE_2D, texture4);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, img4);
		//gl.generateMipmap(gl.TEXTURE_2D);
		setupTextureFilteringAndMips(img4.width, img4.height);
	});
	texture5 = gl.createTexture();

	gl.bindTexture( gl.TEXTURE_2D, texture5 );
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
		new Uint8Array([0, 0, 255, 255]));

	img5 = new Image()
	img5.src = "texture5.jpg";//"checkered.jpg";
	img5.addEventListener('load', function() {
		// Now that the image has loaded make copy it to the texture.
		gl.bindTexture(gl.TEXTURE_2D, texture5);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, img5);
		//gl.generateMipmap(gl.TEXTURE_2D);
		setupTextureFilteringAndMips(img5.width, img5.height);
	});
	texture6 = gl.createTexture();

	gl.bindTexture( gl.TEXTURE_2D, texture6 );
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
		new Uint8Array([0, 0, 255, 255]));

	img6 = new Image()
	img6.src = "texture6.jpg";//"checkered.jpg";
	img6.addEventListener('load', function() {
		// Now that the image has loaded make copy it to the texture.
		gl.bindTexture(gl.TEXTURE_2D, texture6);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, img6);
		//gl.generateMipmap(gl.TEXTURE_2D);
		setupTextureFilteringAndMips(img6.width, img6.height);
	});
	texture7 = gl.createTexture();

	gl.bindTexture( gl.TEXTURE_2D, texture7 );
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
		new Uint8Array([0, 0, 255, 255]));

	img7 = new Image()
	img7.src = "checkered.jpeg";
	img7.addEventListener('load', function() {
		// Now that the image has loaded make copy it to the texture.
		gl.bindTexture(gl.TEXTURE_2D, texture7);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, img7);
		//gl.generateMipmap(gl.TEXTURE_2D);
		setupTextureFilteringAndMips(img7.width, img7.height);
	});



}



var tBuffer;
window.onload = function init() {

	canvas = document.getElementById( "gl-canvas" );

	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	gl.enable(gl.DEPTH_TEST);

	//
	//  Load shaders and initialize attribute buffers
	//
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );



	var cBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );

	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );

	var vBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	tBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoord2), gl.STATIC_DRAW );

	var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
	gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vTexCoord );

	var indexBufferID = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBufferID );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW );



	configureTexture();

	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, texture1 );
	gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);

	gl.activeTexture( gl.TEXTURE1 );
	gl.bindTexture( gl.TEXTURE_2D, texture7 );
	gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);

	thetaLoc = gl.getUniformLocation(program, "theta");
	renderTypeLoc = gl.getUniformLocation(program , "renderType");
	modelMatLoc = gl.getUniformLocation(program , "model");

	document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
	document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
	document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
	document.getElementById("ButtonT").onclick = function(){flag = !flag;};
	document.getElementById("Check").onclick = function(){renderType = 1;};
	document.getElementById("Multi").onclick = function(){renderType = 2;};
	document.getElementById("Merge").onclick = function(){renderType = 3;};

	render();
}

function draw(tex , num ,model)
{

	gl.uniformMatrix4fv(modelMatLoc , false , flatten(model)  );
	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, tex );
	gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
	gl.drawElements( gl.TRIANGLES,  6	 , gl.UNSIGNED_BYTE , num);
}

var render = function() {


	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	if(flag) theta[axis] += 2.0;
	gl.uniform3fv(thetaLoc, theta);
	gl.uniform1i(renderTypeLoc , renderType);


	gl.activeTexture( gl.TEXTURE1 );
	gl.bindTexture( gl.TEXTURE_2D, texture7 );
	gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);

	model = new mat4();
	draw(texture1 , 0, model);
	model = translate(0 , 0 , -1);
	draw(texture2 , 0 , model);

	model = rotate(90  , [ 0, 1 , 0])
	draw(texture3 , 0 , model);

	model = rotate(90  , [ 0, 1 , 0])
	model = mult(translate(-1 , 0 , 0) , model);
	draw(texture4 , 0 ,model);

	model = rotate(90  , [ 1, 0 , 0])

	draw(texture5 , 0,model);
	model = rotate(90  , [ 1, 0 , 0])
	model = mult(translate(0 , 1 , 0) , model);
	draw(texture6 , 0,model);


	requestAnimFrame(render);
}
