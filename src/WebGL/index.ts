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

  // Set the vertex coordinates and color (the blue triangle is in the front)
  const n = initVertexBuffer(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);
  // Enable alpha blending
  gl.enable(gl.BLEND);
  // Set blending function
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // get the storage locations of u_ViewMatrix and u_ProjMatrix
  const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if (!u_ViewMatrix || !u_ProjMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix and/or u_ProjMatrix');
    return;
  }

  // Create the view projection matrix
  const viewMatrix = new Matrix4();
  // Register the event handler to be called on key press
  window.addEventListener('keydown', function (ev) {
    keydown(ev, gl, n, u_ViewMatrix, viewMatrix);
  });

  // Create Projection matrix and set to u_ProjMatrix
  const projMatrix = new Matrix4();
  projMatrix.setOrtho(-1, 1, -1, 1, 0, 2);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  // Draw
  draw(gl, n, u_ViewMatrix, viewMatrix);
}

function initVertexBuffer(gl: WebGL2RenderingContext) {
  /* prettier-ignore */
  const verticesColors = new Float32Array([
    // Vertex coordinates and color(RGBA)
    0.0,  0.5,  -0.4,  0.4,  1.0,  0.4,  0.4, // The back green one
   -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,  0.4,
    0.5, -0.5,  -0.4,  1.0,  0.4,  0.4,  0.4,

    0.5,  0.4,  -0.2,  1.0,  0.4,  0.4,  0.4, // The middle yellow one
   -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,  0.4,
    0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,  0.4,

    0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  0.4,  // The front blue one
   -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,  0.4,
    0.5, -0.5,   0.0,  1.0,  0.4,  0.4,  0.4,
  ]);
  /* prettier-ignore */

  const n = 9; // The number of vertices

  // Create the buffer object
  const vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  const FSIZE = verticesColors.BYTES_PER_ELEMENT;

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 7, 0);
  gl.enableVertexAttribArray(a_Position); // Enable the assignment of the buffer object

  const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  // Assign the buffer object to a_Color variable
  gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE * 7, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color); // Enable the assignment of the buffer object

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

// Eye position
let g_EyeX = 0.2;
const g_EyeY = 0.25;
const g_EyeZ = 0.25;
function keydown(
  ev: KeyboardEvent,
  gl: WebGL2RenderingContext,
  n: number,
  u_ViewMatrix: WebGLUniformLocation,
  viewMatrix: Matrix4,
) {
  if (ev.keyCode == 39) {
    // The right arrow key was pressed
    g_EyeX += 0.01;
  } else if (ev.keyCode == 37) {
    // The left arrow key was pressed
    g_EyeX -= 0.01;
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
  viewMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ, 0, 0, 0, 0, 1, 0);

  // Pass the view projection matrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
