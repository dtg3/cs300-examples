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
var points;

// delaring a global constant
const NUMPOINTS = 5000;

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

    // Initialize Sierpinski Gasket Data *******************

    // Setup the the three vertices of the gasket (triangle)
    // vec2 comes from MV.js
    var vertices = [ vec2(-1, -1), vec2(0, 1), vec2(1, -1) ];

    // Calculate our starting point (p) for the iterations
    // Remember that p must lie within any three vertices
    // add comes from MV.js
    var u = add(vertices[0], vertices[1]);
    var v = add(vertices[0], vertices[2]);

    // scale comes from MV.js and simply applies the scale factor (multiply by .5) to each
    // of the elements in the vector (the results from add(u ,v)).
    var p = scale(0.5, add(u, v));
    
    // put the initial p value into a list of point vectors
    points = [p];

    /*
        Create new points.
        Where each point is midway between the last point and a randomly chosen
        vertex from the array of vertices
    */
    for (var i = 0; points.length < NUMPOINTS; ++i) {
        /* 
            Math is provided by standard javascript
            Math.random provides a value in the range [0, 1), 
            multiplying by three yields resulting values between 0 and 2.
        */
        var j = Math.floor(Math.random() * 3)
        p = add(points[i], vertices[j]);
        p = scale(0.5, p);
        
        // push appends values to the end of the array
        points.push(p)
    }

    
    //  Configure WebGL *******************

    // gl is a WebGLRenderingContext object that allows us to interact with WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load the shader programs and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    // Load the data into the GPU
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    /* 
        flatten comes from MV.js and converts the data in the points array to native types (floats) as 
        WebGL does not understand javascript objects.
    */
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
}

// Tell WebGL to draw the data as points
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, NUMPOINTS);
}