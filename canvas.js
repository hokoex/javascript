// WebGL - Animation, Not Frame Rate Independent
// from https://webglfundamentals.org/webgl/webgl-animation-not-frame-rate-independent.html

  "use strict";

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["3d-vertex-shader", "3d-fragment-shader"]);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var colorLocation = gl.getAttribLocation(program, "a_color");

  // lookup uniforms
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Put geometry data into buffer
  setGeometry(gl);

  // Create a buffer to put colors in
  var colorBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = colorBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // Put geometry data into buffer
  setColors(gl);

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var translation = [0, -70, -360];
  var rotation = [degToRad(190), degToRad(40), degToRad(180)];
  var scale = [1, 1, 1];
  var fieldOfViewRadians = degToRad(60);
  var rotationSpeed = 1.2;

  drawScene();

  // Draw the scene.
  function drawScene() {
    // Every frame increase the rotation a little.
    rotation[1] += rotationSpeed / 60.0;  // don't do this

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Turn on culling. By default backfacing triangles
    // will be culled.
    

    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset)

    // Turn on the color attribute
    gl.enableVertexAttribArray(colorLocation);

    // Bind the color buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 3;                 // 3 components per iteration
    var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
    var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
    var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;               // start at the beginning of the buffer
    gl.vertexAttribPointer(
        colorLocation, size, type, normalize, stride, offset)

    // Compute the matrices
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var matrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);
    matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 117;
    gl.drawArrays(primitiveType, offset, count);

    // Call drawScene again next frame
    requestAnimationFrame(drawScene);
  }
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
//nose
		0, 30, 15, 
		-10, 10, -10, 
		10, 10, -10, 

		//nose long-part
		0, 30, 15, 
		15, 60, -70, 
		-15, 60, -70, 

		//nose left
		0, 30, 15, 
		-15, 60, -70, 
		-20, 32, -75, 

		//nose left 2
		0, 30, 0.15, 
		-20, 32, -75, 
		-10, 10, -10, 

		//nose right
		0, 30, 15,
		15, 60, -70, 
		20, 32, -75, 

		//nose right 2
		0, 30, 15, 
		20, 32, -75, 
		10, 10, -10, 

		//chin left
		-10, 10, -10, 
		-20, 32, -75, 
		-10, -1, -85, 

		//chin right
		10, 10, -10, 
		20, 32, -75, 
		10, -1, -85, 

		//chin bottom
		-10, 10, -10, 
		-10, -1, -85, 
		10, 10, -10, 

		//chin bottom 2
		10, 10, -10, 
		10, -1, -85, 
		-10, -1, -85, 

		//forehead center
		-15, 60, -70, 
		15, 60, -70, 
		15, 90, -80, 

		//forehead center 2
		-15, 60, -70, 
		15, 90, -80, 
		-15, 90, -80, 

		//forehead semi-top
		-15, 90, -80, 
		15, 90, -80, 
		15, 130, -125, 

		//forehead semi-top 2
		-15, 90, -80, 
		15, 130, -125, 
		-15, 130, -125, 

		//head front left
		-15, 90, -80, 
		-15, 130, -125, 
		-55, 80, -140, 

		//head front right
		15, 90, -80, 
		15, 130, -125, 
		55, 80, -140, 

		// ear left
		-15, 130, -125, 
		-55, 80, -140, 
		-60, 200, -130, 

		// ear right
		15, 130, -125, 
		55, 80, -140, 
		60, 200, -130, 

		//ear left back
		-55, 80, -140, 
		-60, 200, -130, 
		-35, 110, -180, 

		//ear right back
		55, 80, -140, 
		60, 200, -130, 
		35, 110, -180, 

		//ear left side
		-15, 130, -125, 
		-60, 200, -130, 
		-35, 110, -180, 

		//ear right side
		15, 130, -125, 
		60, 200, -130, 
		35, 110, -180, 

		//eyes left
		-20, 32, -75, 
		-15, 60, -70, 
		-55, 80, -140, 

		//eyes left 2
		-55, 80, -140, 
		-15, 60, -70, 
		-15, 90, -80, 

		//eyes right
		20, 32, -75,
		15, 60, -70, 
		55, 80, -140, 

		//eyes right 2
		55, 80, -140, 
		15, 60, -70, 
		15, 90, -80, 

		//head side left
		-20, 32, -75, 
		-55, 80, -140, 
		-43, 16, -120, 

		//head side right
		20, 32, -75, 
		55, 80, -140, 
		43, 16, -120, 

		//head side-bottom left
		-20, 32, -75,
		-43, 16, -120, 
		-10, -1, -85, 

		//head side-bottom left
		20, 32, -75, 
		43, 16, -120, 
		10, -1, -85, 

		//head semi-back left
		-40, 19, -160, 
		-55, 80, -140, 
		-43, 16, -120, 

		//head semi-back right
		40, 19, -160, 
		55, 80, -140, 
		43, 16, -120, 

		//head semi-back left 2
		-40, 19, -160, 
		-55, 80, -140, 
		-35, 110, -180, 

		//head semi-back right 2
		40, 19, -160, 
		55, 80, -140, 
		35, 110, -180, 

		//head back-bottom left 2
		-40, 19, -160, 
		-35, 110, -180, 
		10, 19, -200, 

		//head back-bottom right 2
		40, 19, -160, 
		35, 110, -180, 
		10, 19, -200, 

		//head back-center right 2
		-35, 110, -180, 
		35, 110, -180, 
		10, 19, -200, 

		//head top-back
		-35, 110, -180, 
		35, 110, -180, 
		-15, 130, -125, 

		//head top-back 2
		-35, 110, -180, 
		35, 110, -180, 
		15, 130, -125]),
      gl.STATIC_DRAW);
}

// Fill the buffer with colors for the 'F'.
function setColors(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
          // left column front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // top rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // middle rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // left column back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // middle rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,

          // top rung right
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,

          // under top rung
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,

          // between top rung and middle
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,

          // top of middle rung
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,

          // right of middle rung
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,

          // bottom of middle rung.
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,

          // right of bottom
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,

          // bottom
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,

          // left side
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
                  // left column front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // top rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // middle rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // left column back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200]),
      gl.STATIC_DRAW);
}

main();
