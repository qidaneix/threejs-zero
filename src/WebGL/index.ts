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

  // Set the vertex coordinates and color (the blue triangle is in the front)
  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Get the storage locations of u_ModelViewMatrix
  const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // Set the matrix to be used for to set the camera view
  const viewMatrix = new Matrix4();

  // Register the event handler to be called on key press
  window.addEventListener('keydown', function (event) {
    keydown(event, gl, n, u_ViewMatrix, viewMatrix);
  });

  draw(gl, n, u_ViewMatrix, viewMatrix); // Draw
}

function initVertexBuffers(gl: WebGL2RenderingContext) {
  /* prettier-ignore */
  const verticesColors = new Float32Array([
    // Vertex coordinates and color(RGBA)
    0.0,  0.5, -0.4,   0.4, 1.0, 0.4, // The back green one
   -0.5, -0.5, -0.4,   0.4, 1.0, 0.4,
    0.5, -0.5, -0.4,   1.0, 0.4, 0.4,

    0.5,  0.4, -0.2,   1.0, 0.4, 0.4, // The middle yellow one
   -0.5,  0.4, -0.2,   1.0, 0.4, 0.4,
    0.0, -0.6, -0.2,   1.0, 1.0, 0.4,

    0.0,  0.5,  0.0,   0.4, 0.4, 1.0, // The front blue one
   -0.5, -0.5,  0.0,   0.4, 0.4, 1.0,
    0.5, -0.5,  0.0,   1.0, 0.4, 0.4,
  ])
  /* prettier-ignore */

  const n = 9;

  // Create a buffer object
  const vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Write the vertex coordinates and color to the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  const FSIZE = verticesColors.BYTES_PER_ELEMENT;
  // Assign the buffer object to a_Position and enable the assignment
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  // Assign the buffer object to a_Color and enable the assignment
  const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

let g_eyeX = 0.2,
  g_eyeY = 0.25;
const g_eyeZ = 0.25; // Eye position
function keydown(
  event: KeyboardEvent,
  gl: WebGL2RenderingContext,
  n: number,
  u_ViewMatrix: WebGLUniformLocation,
  viewMatrix: Matrix4,
) {
  if (event.keyCode === 39) {
    // The right arrow key was pressed
    g_eyeX += 0.01;
  } else if (event.keyCode === 37) {
    // The left arrow key was pressed
    g_eyeX -= 0.01;
  } else if (event.keyCode === 38) {
    // The up arrow key was pressed
    g_eyeY += 0.01;
  } else if (event.keyCode === 40) {
    // The down arrow key was pressed
    g_eyeY -= 0.01;
  } else return;

  draw(gl, n, u_ViewMatrix, viewMatrix);
}

function draw(
  gl: WebGL2RenderingContext,
  n: number,
  u_ViewMatrix: WebGLUniformLocation,
  viewMatrix: Matrix4,
) {
  // Set the matrix to be used for to set the camera view
  viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

  // Pass the view matrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

  gl.drawArrays(gl.TRIANGLES, 0, n); // Draw the triangle
}
