export function initVertexBuffers(gl: WebGL2RenderingContext) {
  /* prettier-ignore */
  const verticesColors = new Float32Array([
    // Vertex coordinates and color(R, G, B, A)
    0.0,  0.5, -0.4, 0.4, 1.0, 0.4, // the back green one
   -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
    0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

    0.5,  0.4, -0.2, 1.0, 0.4, 0.4, // the middle yellow one
   -0.5,  0.4, -0.2, 1.0, 1.0, 0.4,
    0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

    0.0,  0.5,  0.0, 0.4, 0.4, 1.0, // the front blue one
   -0.5, -0.5,  0.0, 0.4, 0.4, 1.0,
    0.5, -0.5,  0.0, 1.0, 0.4, 0.4,
  ]);
  /* prettier-ignore */

  const n = 9; // 点的个数

  // create buffer object
  const vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // write the vertex coordinates and color to the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  const FSIZE = verticesColors.BYTES_PER_ELEMENT;
  // assign the buffer object to a_Position variable and enable the assignment
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  // assign the buffer object to a_Color variable and enable the assignment
  const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  // unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}
