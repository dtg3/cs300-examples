"use strict";

//Globals
var gl;
var points = [];
var colors = [];
var point_buffer;
var xDir = 0.01;
var yDir = 0.01;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    // Book Code
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL is not available!");
    }

    points.push(vec2(0.0, 0.0));
    colors.push(vec3(1.0, 0.0, 0.0));
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    point_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, point_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    update();
}

function direction() {
    let value = Math.random() * 1 + 1;
    return value / 100;
}

function update() {
    render();

    points[0] = add(points[0], vec2(xDir, yDir));

    if (points[0][0] >= 1) {
        xDir = -1 * direction();
    }
    if (points[0][1] >= 1) {
        yDir = -1 * direction();
    }
    if (points[0][0] <= -1) {
        xDir = direction();
    }
    if (points[0][1] <= -1) {
        yDir = direction();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, point_buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));

    window.requestAnimationFrame(update);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.length);
}