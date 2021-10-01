"use strict";

// delare global variables
var gl;
var points = [];
var colors;
var colorsLoc;
var ctms;
var ctmLoc;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) {
        alert("WebGL is not available!");
    }

    //Square
    points.push(vec3(-0.5, -0.5, 0.1), vec3(0.5, -0.5, 0.1), vec3(0.5, 0.5, 0.1), vec3(-0.5, 0.5, 0.1));
    
    colors = [
        vec4(1.0, 0.0, 0.0, 1.0), //red
        vec4(0.0, 1.0, 0.0, 1.0), //green
        vec4(0.0, 0.0, 1.0, 1.0), //blue
        vec4(1.0, 0.0, 1.0, 1.0), //Magenta
        vec4(0.0, 1.0, 1.0, 1.0) //Cyan
    ];

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

    ctmLoc = gl.getUniformLocation(program, "transformation");
    colorsLoc = gl.getUniformLocation(program, "uColor");

    ctms = [
        mat4(),
        mat4(),
        mat4(),
        mat4(),
        mat4()
    ];
   
    render();
}

// Tell WebGL to draw the data as points
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    ctms.forEach((ctm, index) => {
        let xmov = -0.5 + index * 0.25;
        ctm = mult(ctm, translate(xmov, 0, 0));
        gl.uniform4fv(colorsLoc, flatten(colors[index]));
        gl.uniformMatrix4fv(ctmLoc, false, flatten(ctm));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    })
    
}