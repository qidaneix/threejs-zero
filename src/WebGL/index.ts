import { initCanvas } from './init-canvas';
import { VSHADER_SOURCE } from './vShanderSource';
import { FSHADER_SOURCE } from './fShanderSource';

export function main(container: HTMLDivElement) {
  // Retrieve <canvas> element
  const ele = initCanvas(container);

  // Get the rendering context for WebGL
  const gl = ele.getContext?.('webgl2');
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // Set vertex coordinates and point sizes
  const n = initVertexBuffer(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw three points
  gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffer(gl: WebGL2RenderingContext) {
  /* prettier-ignore */
  const vertexSizes = new Float32Array([
    // Coordinate and size of points
     0.0, 0.5, 10, // the 1st point
    -0.5, -0.5, 20, // the 2nd point
     0.5, -0.5, 30, // the 3rd point
  ])
  /* prettier-ignore */

  const n = 3; // The number of vertices
  const FSIZE = vertexSizes.BYTES_PER_ELEMENT;

  // Create a buffer object
  const buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexSizes, gl.STATIC_DRAW);

  //Get the storage location of a_Position and a_PointSize
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_Position < 0 || a_PointSize < 0) {
    console.log('Failed to get the storage location of a_Position or a_PointSize');
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
  gl.enableVertexAttribArray(a_Position); // Enable the assignment of the buffer object

  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
  gl.enableVertexAttribArray(a_PointSize); // Enable buffer allocation

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}
