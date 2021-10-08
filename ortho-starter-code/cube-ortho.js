"use strict";

var gl;

var pointsArray = [];
var colorsArray = [];

// Uniform Pointers
var modelViewUniLoc, projectionUniLoc;

// Viewing Volume
var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;
var near = -1.0;
var far = 1.0;

// Camera
var eye;

var radius = 1.0;
var theta = 0.0;
var phi = 0.0;

const CAMERA_ROTATION_VALUE = 5.0 * Math.PI/180;
const AT = vec3(0.0, 0.0, 0.0);
const UP = vec3(0.0, 1.0, 0.0);

var eyePosLabel;
var viewVolumeLabel;

const vertexColors = [
        vec4(0.0, 0.0, 0.0, 1.0),  // black
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        vec4(0.0, 1.0, 0.0, 1.0),  // green
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(0.0, 1.0, 1.0, 1.0),  // cyan
        vec4(1.0, 1.0, 1.0, 1.0),  // white
    ];

// quad uses first index to set color for face
function quad(a, b, c, d) {

    let vertices = [
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4(-0.5,  0.5,  0.5, 1.0),
        vec4( 0.5,  0.5,  0.5, 1.0),
        vec4( 0.5, -0.5,  0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5,  0.5, -0.5, 1.0),
        vec4( 0.5,  0.5, -0.5, 1.0),
        vec4( 0.5, -0.5, -0.5, 1.0),
    ];

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
}

// Each face determines two triangles

function colorCube()
{
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

window.onload = function init() {
    let canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL(canvas);
    if ( !gl ) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewUniLoc = gl.getUniformLocation(program, "modelView");
    projectionUniLoc = gl.getUniformLocation(program, "projection");

    eyePosLabel = document.getElementById("eyePos");
    viewVolumeLabel = document.getElementById("viewVolume");

    // Button Functions
    document.getElementById("increaseNear").onclick = function() {
        near *= 1.1;
    }
    document.getElementById("decreaseNear").onclick = function() {
        near *= 0.9;
    }
    document.getElementById("increaseFar").onclick = function() {
        far *= 1.1;
    }
    document.getElementById("decreaseFar").onclick = function() {
        far *= 0.9
    }
    document.getElementById("increaseLeft").onclick = function() {
        left *= 1.1;
    }
    document.getElementById("decreaseLeft").onclick = function() {
        left *= 0.9
    }
    document.getElementById("increaseRight").onclick = function() {
        right *= 1.1;
    }
    document.getElementById("decreaseRight").onclick = function() {
        right *= 0.9
    }
    document.getElementById("increaseTop").onclick = function() {
        ytop *= 1.1;
    }
    document.getElementById("decreaseTop").onclick = function() {
        ytop *= 0.9
    }
    document.getElementById("increaseBottom").onclick = function() {
        bottom *= 1.1;
    }
    document.getElementById("decreaseBottom").onclick = function() {
        bottom *= 0.9
    }
    document.getElementById("increaseRadius").onclick = function() {
        radius *= 1.1;
    }
    document.getElementById("decreaseRadius").onclick = function() {
        radius *= 0.9;
    }
    document.getElementById("moveCameraRight").onclick = function() {
        phi += CAMERA_ROTATION_VALUE;
    }
    document.getElementById("moveCameraLeft").onclick = function() {
        phi -= CAMERA_ROTATION_VALUE;
    }
    document.getElementById("moveCameraUp").onclick = function() {
        theta += CAMERA_ROTATION_VALUE;
    }
    document.getElementById("moveCameraDown").onclick = function() {
        theta -= CAMERA_ROTATION_VALUE;
    }

    render();
}

function updateLabels() {
    eyePosLabel.innerHTML = "x: " + eye[0] + ", y: " + eye[1] + ", z: " + eye[2];
    
    viewVolumeLabel.innerHTML = "l: " + left + ", r: " + right + 
    ", b: " + bottom + ", t: " + ytop +
    ", n: " + near + ", f: " + far;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius * Math.sin(phi), radius * Math.sin(theta),
               radius * Math.cos(phi));
    
    updateLabels();

    let mvMatrix = lookAt(eye, AT, UP);
    let pMatrix = ortho(left, right, bottom, ytop, near, far);

    gl.uniformMatrix4fv(modelViewUniLoc, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(projectionUniLoc, false, flatten(pMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);
    requestAnimationFrame(render);
}
