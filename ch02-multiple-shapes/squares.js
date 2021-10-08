"use strict";

var gl;
var points = [];
var colors = [];

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) {
        alert("WebGL not found!");
    }

    // SQUARE 1
    points.push( vec2(-0.9, 0.0), vec2(-0.9, 0.5), vec2(-0.25, 0.0), vec2(-0.25, 0.5) );
    colors.push( vec3(1.0, 0.0, 0.0), vec3(1.0, 0.0, 0.0), vec3(1.0, 0.0, 0.0), vec3(1.0, 0.0, 0.0));

    // SQUARE 2
    points.push( vec2(0.9, 0.0), vec2(0.9, -0.5), vec2(0.25, 0.0), vec2(0.25, -0.5) );
    colors.push( vec3(0.0, 0.0, 1.0), vec3(0.0, 0.0, 1.0), vec3(0.0, 0.0, 1.0), vec3(0.0, 0.0, 1.0));


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0 , 1.0);

    var programs = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(programs);

    var point_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, point_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vertex_position = gl.getAttribLocation(programs, "vPosition");
    gl.vertexAttribPointer(vertex_position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertex_position);

    var color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vertex_color = gl.getAttribLocation(programs, "vColor");
    gl.vertexAttribPointer(vertex_color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertex_color);

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);
    
}