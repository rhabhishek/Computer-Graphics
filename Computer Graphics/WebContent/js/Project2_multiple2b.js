var canvas, gl, program;
var canvas2, gl2, program2;

var NUM_VERTICES = 36, CUBE_SIZE = 6.0;
var ROWS = 3, COLS = 3;

var vertices = [
 vec4( -1/6, -1/6,  1/6, 1.0 ),
    vec4( -1/6,  1/6,  1/6, 1.0 ),
    vec4(  1/6,  1/6,  1/6, 1.0 ),
    vec4(  1/6, -1/6,  1/6, 1.0 ),
    vec4( -1/6, -1/6, -1/6, 1.0 ),
    vec4( -1/6,  1/6, -1/6, 1.0 ),
    vec4(  1/6,  1/6, -1/6, 1.0 ),
    vec4(  1/6, -1/6, -1/6, 1.0 )
];
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),
    vec4( 1.0, 0.0, 0.0, 1.0 ),
    vec4( 1.0, 1.0, 0.0, 1.0 ),
    vec4( 0.0, 1.0, 0.0, 1.0 ),
    vec4( 0.0, 0.0, 1.0, 1.0 ),
    vec4( 1.0, 0.0, 1.0, 1.0 ),
    vec4( 1.0, 1.0, 1.0, 1.0 ),
    vec4( 0.0, 1.0, 1.0, 1.0 )
];
var cubeRotationAngle = [
    [
        [ 1,  0,  0],
        [ 1,  1,  0],
        [ 1,  0,  1]
    ],
    [
        [-1, -1,  0],
        [ 0,  1,  0],
        [ 0,  1,  1]
    ],
    [
        [-1,  0, -1],
        [ 0, -1, -1],
        [ 0,  0,  1]
    ]
];

var modelViewMatrixLoc, projectionMatrix, thetaLoc;
var vBuffer, cBuffer, vBuffer2, cBuffer2;
var theta = 2, axis = 0;
var theta2 = [0, 0, 0];
var points = [], colors = [];


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable( gl.DEPTH_TEST );

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube(vertices, points);

    // Create and initialize  buffer objects
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );

    render();
};


function quad(  a,  b,  c,  d, vertexV, pointP ) {
    var indices = [a, b, c, a, c, d];
    for (var i = 0; i < indices.length; ++i) {
        pointP.push(vertexV[indices[i]]);
        colors.push(vertexColors[indices[i]]);
    }
}

function colorCube(vertexV, pointP) {
    quad( 1, 0, 3, 2, vertexV, pointP);
    quad( 2, 3, 7, 6, vertexV, pointP);
    quad( 3, 0, 4, 7, vertexV, pointP);
    quad( 6, 5, 1, 2, vertexV, pointP);
    quad( 4, 5, 6, 7, vertexV, pointP);
    quad( 5, 4, 0, 1, vertexV, pointP);
}

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

function base(modelViewMatrixNew) {
    var instanceMatrix = mult(translate(0.0, 0.0, 0.0), scale4(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE));
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(mult(modelViewMatrixNew, instanceMatrix)));
    gl.drawArrays( gl.TRIANGLES, 0, NUM_VERTICES );
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
        theta +=2;
    var TOP = CUBE_SIZE;
    for(var r = 0; r < ROWS; r++) {
        var TOP_LEFT = -CUBE_SIZE;
        for(var c = 0; c < COLS; c++) {
            base(mult(translate(TOP_LEFT, TOP, 0.0), rotate(theta, cubeRotationAngle[r][c])));
            TOP_LEFT += CUBE_SIZE;
        }
        TOP -= CUBE_SIZE;
    }
    requestAnimFrame(render);
}

