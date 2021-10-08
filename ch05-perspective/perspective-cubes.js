"use strict";

var canvas;
var gl;

var pointsArray = [];
var colorsArray = [];

var vertices = [
    vec4(0.5,  0.5, 0.5, 1.0),
    vec4(0.5,  0.9, 0.5, 1.0),
    vec4(0.9,  0.9, 0.5, 1.0),
    vec4(0.9,  0.5, 0.5, 1.0),
    vec4(0.5,  0.5, 0.9, 1.0),
    vec4(0.5,  0.9, 0.9, 1.0),
    vec4(0.9,  0.9, 0.9, 1.0),
    vec4(0.9,  0.5, 0.9, 1.0)
];

var vertices2 = [
    vec4(-0.9, -0.5, 1.5, 1.0),
    vec4(-0.9, -0.9, 1.5, 1.0),
    vec4(-0.5, -0.9, 1.5, 1.0),
    vec4(-0.5, -0.5, 1.5, 1.0),
    vec4(-0.9, -0.5, 1.9, 1.0),
    vec4(-0.9, -0.9, 1.9, 1.0),
    vec4(-0.5, -0.9, 1.9, 1.0),
    vec4(-0.5, -0.5, 1.9, 1.0)
];

var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(1.0, 1.0, 1.0, 1.0),  // white
];


// View Volume Dimensions
var near = 0.3;
var far = 3.0;
var fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var aspect;       // Viewport aspect ratio

// Camera Variables
var eye;
var radius = 4.0;
var theta = 0.0;
var phi = 0.0;
const CAMERA_ANGLE = 5.0 * Math.PI/180.0;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

// Model and Projection Matrices
var mvMatrix, pMatrix;
var modelView, projection;

function quad2(a, b, c, d) {
    pointsArray.push(vertices2[a]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices2[b]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices2[c]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices2[a]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices2[c]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices2[d]);
    colorsArray.push(vertexColors[a]);
}

function quad(a, b, c, d) {
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

function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function colorCube2() {
    quad2(1, 0, 3, 2);
    quad2(2, 3, 7, 6);
    quad2(3, 0, 4, 7);
    quad2(6, 5, 1, 2);
    quad2(4, 5, 6, 7);
    quad2(5, 4, 0, 1);
}


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL( canvas );
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);

    aspect = canvas.width/canvas.height;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();
    colorCube2();

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

    modelView = gl.getUniformLocation(program, "modelView");
    projection = gl.getUniformLocation(program, "projection");

    // buttons for viewing parameters
    document.getElementById("increaseNear").onclick = function(){ near  += 0.2; };
    document.getElementById("decreaseNear").onclick = function(){ near  -= 0.2; };
    document.getElementById("increaseFar").onclick = function(){ far += 0.2; };
    document.getElementById("decreaseFar").onclick = function(){ far -= 0.2; };

    document.getElementById("increaseRadius").onclick = function(){ radius -= 0.1; };
    document.getElementById("decreaseRadius").onclick = function(){ radius += 0.1; };

    document.getElementById("increaseFOV").onclick = function(){ fovy -= 2.0; };
    document.getElementById("decreaseFOV").onclick = function(){ fovy += 2.0; };

    document.getElementById("Increase Theta").onclick = function(){ theta += CAMERA_ANGLE; };
    document.getElementById("Decrease Theta").onclick = function(){ theta -= CAMERA_ANGLE; };
    document.getElementById("Increase Phi").onclick = function(){ phi += CAMERA_ANGLE; };
    document.getElementById("Decrease Phi").onclick = function(){ phi -= CAMERA_ANGLE; };

    render();
}


var render = function() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    mvMatrix = lookAt(eye, at, up);
    pMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(projection, false, flatten(pMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);
    requestAnimationFrame(render);
}
