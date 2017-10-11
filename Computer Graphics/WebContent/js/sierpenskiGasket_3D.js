var gl;
var colorsArray = [];
var pointsArray = [];
var baseColors = [];
var divideCount = 3;

window.onload = function init(){
	
	var canvas = document.getElementById( "gl-canvas" );
        
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { 
		alert( "WebGL isn't available" );
	}
	
//  Configure WebGL
	 
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	
	
	gl.enable(gl.DEPTH_TEST);
								
	// A triangle in the plane z= 0
	
	
	var vertices = new Array();
	vertices = [
		vec3(  0.0000,  0.0000, -1.0000),
		vec3(  0.0000,  0.9428,  0.3333),
		vec3( -0.8165, -0.4714,  0.3333),
		vec3(  0.8165, -0.4714,  0.3333)
	];
	
	divideTetra(vertices[0],vertices[1],vertices[2],vertices[3],divideCount);
	
	//  Load shaders and initialize attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
	
	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(colorsArray),gl.STATIC_DRAW);
	
	    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
      var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
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
				moveTetra(evt, gl, canvas, program, vPosition, cBuffer, 
						vBuffer);
		}
	);
	render();
};

function moveTetra(evt, gl, canvas, program, vPosition, vBuffer, 
							cBuffer) {
	var x = evt.clientX;
	var y = evt.clientY;
                        // scale to NDC (-1, 1 in X and Y)
	var points = 
		[ 	-1. + x*2.0/canvas.width , 
			-1. + (canvas.height-y)*2.0/canvas.height ];

						// update the point to the mouse position

	vertices = [
	    		 vec3(points[0], points[1], 0.0),
	    		vec3(  0.0000,  0.9428,  0.3333),
	    		vec3( -0.8165, -0.4714,  0.3333),
	    		vec3(  0.8165, -0.4714,  0.3333)
	    	];
	pointsArray = new Array();
	divideTetra(vertices[0],vertices[1],vertices[2],vertices[3],divideCount);
	
	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(colorsArray),gl.STATIC_DRAW);
	
	    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
      var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	    
    render();
};

//render the data in the array buffer
function render() {
	
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawArrays( gl.TRIANGLES, 0, pointsArray.length);
};



function triangle(a,b,c,color){

	baseColors = [
					vec3(  1.0,  0.0,  0.0),
					vec3(  0.0,  1.0,  0.0),
					vec3(  0.0,  0.0,  1.0),
					vec3(  0.0,  0.0,  0.0)
	              ];
	
	colorsArray.push(baseColors[color]);
	pointsArray.push(a);
	colorsArray.push(baseColors[color]);
	pointsArray.push(b);
	colorsArray.push(baseColors[color]);
	pointsArray.push(c);
}

function tetra(a,b,c,d){
	triangle(a,c,b,0);
	triangle(a,c,d,1);
	triangle(a,b,d,2);
	triangle(b,c,d,3);
}



function divideTetra(a,b,c,d,count){
	if(count === 0){
		tetra(a,b,c,d);
	}
	else{
		var ab = mix(a,b,0.5);
		var ac = mix(a,c,0.5);
		var ad = mix(a,d,0.5);
		var bc = mix(b,c,0.5);
		var bd = mix(b,d,0.5);
		var cd = mix(c,d,0.5);
		
		--count;
		
		divideTetra(a,ab,ac,ad,count);
		divideTetra(ab,b,bc,bd,count);
		divideTetra(ac,bc,c,cd,count);
		divideTetra(ad,bd,cd,d,count);
	}

}