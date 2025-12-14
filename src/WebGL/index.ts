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

  // get the storage location of u_ProjMatrix
  const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if (!u_ProjMatrix) {
    console.log('Failed to get the storage location of u_ProjMatrix');
    return;
  }

  // Create the matrix to set the eye point, and the line of sight
  const projMatrix = new Matrix4();
  // Register the event handler to be called on key press
  window.addEventListener('keydown', function (event) {
    keydown(event, gl, n, u_ProjMatrix, projMatrix);
  });

  draw(gl, n, u_ProjMatrix, projMatrix); // Draw
}

function initVertexBuffers(gl: WebGL2RenderingContext) {
  /* prettier-ignore */
  const verticesColors = new Float32Array([
    // Vertex coordinates and color
     0.0,  0.6,  -0.4,  0.4,  1.0,  0.4, // The back green one
    -0.5, -0.4,  -0.4,  0.4,  1.0,  0.4,
     0.5, -0.4,  -0.4,  1.0,  0.4,  0.4,

     0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
    -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
     0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,

     0.0,  0.5,   0.0,  0.4,  0.4,  1.0, // The front blue one
    -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
     0.5, -0.5,   0.0,  1.0,  0.4,  0.4,
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

// The distances to the near and far clipping plane (hundredfold of the real value)
let g_near = 0.0,
  g_far = 0.5;
function keydown(
  event: KeyboardEvent,
  gl: WebGL2RenderingContext,
  n: number,
  u_ProjMatrix: WebGLUniformLocation,
  projMatrix: Matrix4,
) {
  switch (event.keyCode) {
    case 39: {
      // The right arrow key was pressed
      g_near += 0.01;
      break;
    }
    case 37: {
      // The left arrow key was pressed
      g_near -= 0.01;
      break;
    }
    case 38: {
      // The up arrow key was pressed
      g_far += 0.01;
      break;
    }
    case 40: {
      // The down arrow key was pressed
      g_far -= 0.01;
      break;
    }
    default:
      return;
  }

  draw(gl, n, u_ProjMatrix, projMatrix);
}

function draw(
  gl: WebGL2RenderingContext,
  n: number,
  u_ProjMatrix: WebGLUniformLocation,
  projMatrix: Matrix4,
) {
  // Specify the viewing volume
  projMatrix.setOrtho(-0.5, 0.5, -0.5, 0.5, g_near, g_far);

  // Pass the view projection matrix
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

  // Display the current near and far values
  console.log(
    'near: ' + Math.round(g_near * 100) / 100 + ', far: ' + Math.round(g_far * 100) / 100,
  );
  gl.drawArrays(gl.TRIANGLES, 0, n); // Draw the triangle
}
