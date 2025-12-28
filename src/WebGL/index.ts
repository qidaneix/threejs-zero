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

  // Set the vertex information
  const n = initVertexBuffer(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw three points
  gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffer(gl: WebGL2RenderingContext) {
  /* prettier-ignore */
  const vertices = new Float32Array([ // Vertex coordinates
     0.0, 0.5,  -0.5, -0.5,  0.5, -0.5,
  ])
  /* prettier-ignore */

  /* prettier-ignore */
  const pointSize = new Float32Array([ // Point sizes
    10, 20, 30,
  ])
  /* prettier-ignore */

  const n = 3;

  // Create a buffer object
  const vertexBuffer = gl.createBuffer();
  const pointSizeBuffer = gl.createBuffer();
  if (!vertexBuffer || !pointSizeBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Write vertex coordinates to the buffer object and enable it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  // Bind the point size buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, pointSizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, pointSize, gl.STATIC_DRAW);
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_PointSize < 0) {
    console.log('Failed to get the storage location of a_PointSize');
    return -1;
  }
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_PointSize);

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}
