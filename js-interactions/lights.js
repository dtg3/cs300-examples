"use strict";
/* 
    The "use strict" directive (literal expression) puts javascript in strict mode
    and MUST appear as the first line of the javascript file (global to the script)
    or javascript function (local to the function).
    This limits certain javascript syntax and features:
    See https://www.w3schools.com/js/js_strict.asp for details
*/

// delare global variables
var gl;
const MAX_POINTS = 2;
/* 
    This assign the browser windows onload function to our init function.
    When the window loads (triggering the onload function), our init function
    code will be run.
*/ 
window.onload = function init() {
    /* 
        document references the HTML document we are creating which has a function
        that allows us to get access to elements in the document using the id attribute
        and a custom name value we provided.
    */
    var canvas = document.getElementById("gl-canvas");

    // Call the setupWebGL function from our webgl-utils.js script
    gl = WebGLUtils.setupWebGL(canvas);

    // Check that the gl context is not NULL
    if (!gl) {
        alert("WebGL is not available!");
    }

    //  Configure WebGL *******************
    // gl is a WebGLRenderingContext object that allows us to interact with WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //  Load the shader programs and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Setup Buffer
    var point_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, point_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizeof['vec3'] * MAX_POINTS, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vec3(0.0, 0.0, 0.0)));
    gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec3'], flatten(vec3(0.5, 0.5, 0.0)));

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Setup Color Buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizeof['vec3'] * MAX_POINTS, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vec3(1.0, 0.0, 0.0)));
    gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec3'], flatten(vec3(0.0, 1.0, 0.0)));

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    render();
}


// Tell WebGL to draw the data as points
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 2);
}