
var canvas;
var gl;
var  floor = 2;
var NumVertices ;
var program ;
//Buffer Variables
var objVert = [];
var objNor = [];
var objFace = [];
var texCoord = [];

//Uniform Locations
var perLoc;
var viewLoc;
var modelLoc;
var floorLoc;
var texture;
//Matrix Variables
var per;
var view;

//Camera Parameters
var eye = vec3(20, 7 ,-18) ;
var at = vec3(0.0, 0.0, -1.0);
var up = vec3(0.0, 1.0, 0.0);


//Projection Parameters
var near = 0.1;
var far = 1000.0;
var  fovy = 90.0;  
var  aspect;
function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

//Utility function to load object
function loadMeshDataFromHTML() {
	var obj = document.getElementById( "obj" );
	string = obj.text 
  var lines = string.split("\n");
  var positions = [];
  var normals = [];
  var vertices = [];
  var textures=[];
 
  for ( var i = 0 ; i < lines.length ; i++ ) {
    var parts = lines[i].trimRight().split(' ');
    if ( parts.length > 0 ) {
      switch(parts[0]) {
        case 'v': //Vertices
		  objVert.push(vec3(parseFloat( parts[1]) , parseFloat( parts[2] ) , parseFloat( parts[3])));
          break;
        case 'vn'://Normals
			objNor.push(vec3(parseFloat( parts[1]) , parseFloat( parts[2] ) , parseFloat( parts[3])));
          break;
		   case 'vt'://Textures
			texCoord.push(vec3(parseFloat( parts[1]) , parseFloat( parts[2] )));
          break;
        case 'f': { //faces
          var f1 = parts[1].split('/');
          var f2 = parts[2].split('/');
          var f3 = parts[3].split('/');
			objFace.push(parseInt( f1[0] - 1));
			objFace.push(parseInt( f2[0]  - 1));
			objFace.push(parseInt( f3[0]  - 1));
          break;
		
        }
      }
    }
  }
	while(objVert.length > objNor.length){
		
		objNor.push(vec3(0.0, 1, 0));
	}
	//create buffers and load data
  var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(objNor), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vNormal);
	
	
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(objVert), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	 var cIBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, cIBuffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(objFace), gl.STATIC_DRAW );

	var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoord), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
	   var image = document.getElementById("texImage");

    configureTexture( image );

    thetaLoc = gl.getUniformLocation(program, "theta");
	
}

function load(){
	//Utility function to setup shader and accquire uniform locations
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	floorLoc = gl.getUniformLocation(program, "floor"); 
  
	aspect = canvas.width / canvas.height;
	per = perspective2(fovy, aspect, near, far);
	
	perLoc  = gl.getUniformLocation(program, "p");
	viewLoc  = gl.getUniformLocation(program, "v");
	modelLoc = gl.getUniformLocation(program, "m");
   
}



window.onload = function init()
{
	//init function
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.clearDepth(1);

	load();
	loadMeshDataFromHTML() ;
	gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
	window.addEventListener("keydown" , function(){
	
	//keyboard event to simulate walk
	right = normalize(cross(at , up));
	look = normalize(subtract(at , eye));
	
	dx = 0.2;
	dy = 0.2;
	X = vec3();
	Y = vec3();
	X[0] = right[0]*dx;
	X[1] = right[1]*dx;
	X[2] = right[2]*dx;
	Y[0] = look[0]*dy;
	Y[1] = look[1]*dy;
	Y[2] = look[2]*dy;
	
	if (event.keyCode == '87') {
		eye = add (eye , Y);
    }
    else if (event.keyCode == '83') {
		eye = subtract (eye , Y);
    }
    else if (event.keyCode == '68') {
	  eye = add (eye , X);
    }
    else if (event.keyCode == '65') {
	   eye = subtract (eye , X);
    }
	
});
    render();
}

vType = 7;
fWal = 1;
function toggleView(){
	//utility function to toggle between views
	vType += 1 ;
	if(vType >= 6 && fWal != 1)
		vType = 0;
}
 function   freeWalk(){
	 fWal *= -1.0;
	 if(fWal == 1.0)
	vType = 7;
	else 
	vType = 0;
 }
  
function perspective2( fovy, aspect, near, far )
{
	//Utility function to compute perspective projection matrix
    var f = 1.0 / Math.tan( radians(fovy) / 2 );
    var d = far - near;

    var result = mat4();
    result[0][0] = f / aspect;
    result[1][1] = f;
    result[2][2] = -(near + far) / d;
    result[2][3] = -2 * near * far / d;
    result[3][2] = -1;
    result[3][3] = 0.0;

    return result;
}
 function setView( type){
	 //Utility function to switch between views
	  x = 26;
	  y = 30;
	  z = 28;
	 if(type == 0){
		view = lookAt( vec3(0 ,  y ,  z), at , up);
	}
	else if(type == 1){
		view = lookAt( vec3(x,  y ,  z), at , up);
	}
	else if(type == 2){
		view = lookAt( vec3(-x,  y ,  z), at , up);
	}
	else if(type == 3){
		view = lookAt( vec3(26,10, -22), at , up);
	}
	else if(type == 4){
		view = lookAt( vec3(-x,  y ,  -z), at , up);
	}
	else if(type == 5){
		view = lookAt( vec3(-x,  y ,  -z), at , up);
	}
	else{
		
		
	 view = lookAt( eye, at , up);
	}
 }
 secondFloorY = 0.0;

  function elevator(){
	  //Utility function to simulate elevator
	 if(floor == 1){
	eye = vec3(-20, 7.5, -9.2) ;
	at = vec3(-0.0, 10.0, -0.0); 
	up = vec3(-1.0, 15.0, 0.0);
    view = lookAt( eye, at , up); 
	floor = 2;
	 }else{
		 floor = 1
		 eye = vec3(-20, 2.0 , -9.2) ;
	at = vec3(-0.0, 5.0, -0.0); 
	up = vec3(-1.0, 15.0, 0.0);
    view = lookAt( eye, at , up); 
		 
	 }
	 
 }
 
 
 function camReset(){
	 //Utility function to reset camera to original position
	eye = vec3(-20, 2.0 , -9.2) ;
	at = vec3(-0.0, 2.0, -0.0); 
	up = vec3(-1.0, 15.0, 0.0);
    view = lookAt( eye, at , up); 
	 
 }

function render()
{
	//Render function
	setView(vType);

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.uniform1f(floorLoc, floor);
	
	var s = 1;
	var model = scale( s, s, s );

	gl.uniformMatrix4fv(perLoc, false, flatten(per));
	gl.uniformMatrix4fv(viewLoc, false, flatten(view));
	gl.uniformMatrix4fv(modelLoc, false, flatten(model));

	if(objFace.length > 0){
	
	gl.drawElements(gl.TRIANGLES , objFace.length, gl.UNSIGNED_SHORT , 0 );
	model =  mult(model , translate(0	 , secondFloorY , 0));
	gl.uniformMatrix4fv(modelLoc, false, flatten(model));
	gl.drawElements(gl.TRIANGLES , objFace.length, gl.UNSIGNED_SHORT , 0 );
	}

    requestAnimFrame( render );
}

