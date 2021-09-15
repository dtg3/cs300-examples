"use strict";

//Globals
var gl;
var points = [];
var point_buffer;
var current_direction;
var uniform_direction;
var uniform_color;
var color_pallet = [];
var color_index = 0;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    // Book Code
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL is not available!");
    }

    color_pallet.push(vec3(1.0, 0.0, 0.0));
    color_pallet.push(vec3(0.0, 1.0, 0.0));
    color_pallet.push(vec3(0.0, 0.0, 1.0));
    color_pallet.push(vec3(1.0, 1.0, 0.0));
    color_pallet.push(vec3(0.0, 1.0, 1.0));
    color_pallet.push(vec3(1.0, 0.0, 1.0));

    points.push(vec2(0.0, 0.0));
    
    current_direction = vec4(0.0, 0.0, 0.0, 0.0);
    
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

    uniform_direction = gl.getUniformLocation(program, "direction");
    uniform_color = gl.getUniformLocation(program, "colorShift");

    gl.bindBuffer(gl.ARRAY_BUFFER, point_buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));

    update();
}

window.onkeydown = function(event) {
    // LEFT
    if (event.keyCode === 37) {
        current_direction[0] -= 0.05;
    }
    // UP
    if (event.keyCode === 38) {
        current_direction[1] += 0.05;
    }
    // RIGHT
    if (event.keyCode === 39) {
        current_direction[0] += 0.05;
    }
    // DOWN
    if (event.keyCode === 40) {
        current_direction[1] -= 0.05;
    }

    if (event.keyCode === 67) {
        color_index = (color_index + 1) % (color_pallet.length - 1);
    }
}

// function direction() {
//     let value = Math.random() * 1 + 1;
//     return value / 100;
// }

function update() {
    gl.uniform3fv(uniform_color, flatten(color_pallet[color_index]));
    render();
    gl.uniform4fv(uniform_direction, flatten(current_direction));
    window.requestAnimationFrame(update);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.length);
}