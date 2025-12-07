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
    console.log('failed to initialize shaders.');
    return;
  }

  // write the positions of vertices to a vertex shader
  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw three points
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl: WebGL2RenderingContext) {
  const vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  const n = 3; // The number of vertices

  // create a buffer object
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // get the storage location of a_Position
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  // assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}
