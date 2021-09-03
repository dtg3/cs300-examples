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


    // Left
    points.push(vec2(-1.0 ,0.0));
    colors.push(vec3(1.0, 0.0, 0.0));

    // Right
    points.push(vec2(1.0 ,0.0));
    colors.push(vec3(1.0, 0.0, 0.0));

    // Top
    points.push(vec2(0.0 ,1.0));
    colors.push(vec3(0.0, 1.0, 0.0));

    // Bottom
    points.push(vec2(0.0 ,-1.0));
    colors.push(vec3(0.0, 1.0, 0.0));

    /* 
        AN EXTRA POINT!
            gl.LINES expects pairs of points to draw a line from one to another
            so if you have an extra point, we don't see anything.
    */
    points.push(vec2(0.5, 0.5))
    colors.push(vec3(0.0, 0.0, 1.0));

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
    gl.drawArrays(gl.LINES, 0, points.length);
}