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
    console.log('Failed to set the vertex information');
    return;
  }

  // Color of Fog
  const fogColor = new Float32Array([0.137, 0.231, 0.423]);
  // Distance of fog [where fog starts, where fog completely covers object]
  const fogDist = new Float32Array([55, 80]);
  // Position of eye point (world coordinate)
  const eye = new Float32Array([25, 65, 35, 1.0]);

  // Get the storage location of uniform variables
  const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  const u_Eye = gl.getUniformLocation(gl.program, 'u_Eye');
  const u_FogColor = gl.getUniformLocation(gl.program, 'u_FogColor');
  const u_FogDist = gl.getUniformLocation(gl.program, 'u_FogDist');
  if (!u_MvpMatrix || !u_ModelMatrix || !u_Eye || !u_FogColor || !u_FogDist) {
    console.log('Failed to get the storage location');
    return;
  }

  // Pass fog color, distances, and eye point to uniform variable
  gl.uniform4fv(u_Eye, eye); // Eye point
  gl.uniform3fv(u_FogColor, fogColor); // Colors
  gl.uniform2fv(u_FogDist, fogDist); // Starting point and end point

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Set clear color and enable hidden surface removal
  gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0); // Color of Fog
  gl.enable(gl.DEPTH_TEST);

  // Pass the model matrix to u_ModelMatrix
  const modelMatrix = new Matrix4();
  modelMatrix.setScale(10, 10, 10);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Pass the model view projection matrix to u_MvpMatrix
  const mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(30, ele.width / ele.height, 1, 1000);
  mvpMatrix.lookAt(eye[0], eye[1], eye[2], 0, 2, 0, 0, 1, 0);
  mvpMatrix.multiply(modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  document.addEventListener('keydown', function (ev: KeyboardEvent) {
    keydown(ev, gl, n, u_FogDist, fogDist);
  });

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffer(gl: WebGL2RenderingContext) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  /* prettier-ignore */
  const vertices = new Float32Array([ // Vertex coordinates
     1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,    // v0-v1-v2-v3 front
     1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,    // v0-v3-v4-v5 right
     1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,    // v0-v5-v6-v1 up
    -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,    // v1-v6-v7-v2 left
    -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,    // v7-v4-v3-v2 down
     1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1     // v4-v7-v6-v5 back
  ])
  /* prettier-ignore */

  /* prettier-ignore */
  const colors = new Float32Array([ // Colors
    0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front
    0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right
    1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up
    1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
    1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
    0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
  ])
  /* prettier-ignore */

  /* prettier-ignore */
  const indices = new Uint8Array([       // Indices of the vertices
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);
  /* prettier-ignore */

  // Write the vertex property to buffers (coordinates and normals)
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) return -1;
  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) return -1;

  // Create a buffer object
  const buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(
  gl: WebGL2RenderingContext,
  data: Float32Array,
  num: number,
  type: number,
  attribute: string,
) {
  // Create a buffer object
  const buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }

  // Write data to the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Assign the buffer object to the attribute variable
  const a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }

  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);
  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return true;
}

function keydown(
  ev: KeyboardEvent,
  gl: WebGL2RenderingContext,
  n: number,
  u_FogDist: WebGLUniformLocation,
  fogDist: Float32Array,
) {
  switch (ev.keyCode) {
    case 38: // Up arrow key -> Increase the maximum distance of fog
      fogDist[1] += 1;
      break;
    case 40: // Down arrow key -> Decrease the maximum distance of fog
      if (fogDist[1] > fogDist[0]) fogDist[1] -= 1;
      break;
    default:
      return;
  }
  gl.uniform2fv(u_FogDist, fogDist); // Pass the distance of fog
  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // Draw
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
