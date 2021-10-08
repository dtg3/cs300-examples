"use strict";

// delare global variables
var gl;
var points = [];
var colors = [];
var ctm;
var ctmLocation;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) {
        alert("WebGL is not available!");
    }

    points.push(vec3(0.5, 0.5, 0.1), vec3(0.7, 0.5, 0.1),
    vec3(0.7, 0.7, 0.1), vec3(0.5, 0.7, 0.1));
    
    colors.push(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0),
    vec3(0.0, 0.0, 1.0), vec3(1.0, 1.0, 1.0));

    //  Configure WebGL *******************
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //  Load the shader programs and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load point data into the GPU
    var point_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, point_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Load color data into the GPU
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    ctm = mat4();
    ctmLocation = gl.getUniformLocation(program, "modelViewMatrix");
    let center = mix(points[0], points[2], 0.5);
    ctm = mult(ctm, translate(center));
    ctm = mult(ctm, rotateZ(45));
    ctm = mult(ctm, translate(negate(center)));
    
    render();
}

// Tell WebGL to draw the data as points
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniformMatrix4fv(ctmLocation, false, flatten(ctm));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length);
}