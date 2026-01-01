import { initCanvas } from './init-canvas';
import { SOLID_VSHADER_SOURCE } from './solidVShaderSource';
import { SOLID_FSHADER_SOURCE } from './solidFShaderSource';
import { TEXTURE_VSHADER_SOURCE } from './textureVShaderSource';
import { TEXTURE_FSHADER_SOURCE } from './textureFShaderSource';

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
  const solidProgram = createProgram(gl, SOLID_VSHADER_SOURCE, SOLID_FSHADER_SOURCE);
  const texProgram = createProgram(gl, TEXTURE_VSHADER_SOURCE, TEXTURE_FSHADER_SOURCE);
  if (!solidProgram || !texProgram) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // Get storage locations of attribute and uniform variables in program object for single color drawing
  solidProgram.a_Position = gl.getAttribLocation(solidProgram, 'a_Position');
  solidProgram.a_Normal = gl.getAttribLocation(solidProgram, 'a_Normal');
  solidProgram.u_MvpMatrix = gl.getUniformLocation(solidProgram, 'u_MvpMatrix');
  solidProgram.u_NormalMatrix = gl.getUniformLocation(solidProgram, 'u_NormalMatrix');

  // Get storage locations of attribute and uniform variables in program object for texture drawing
  texProgram.a_Position = gl.getAttribLocation(texProgram, 'a_Position');
  texProgram.a_Normal = gl.getAttribLocation(texProgram, 'a_Normal');
  texProgram.a_TexCoord = gl.getAttribLocation(texProgram, 'a_TexCoord');
  texProgram.u_MvpMatrix = gl.getUniformLocation(texProgram, 'u_MvpMatrix');
  texProgram.u_NormalMatrix = gl.getUniformLocation(texProgram, 'u_NormalMatrix');
  texProgram.u_Sampler = gl.getUniformLocation(texProgram, 'u_Sampler');

  if (
    solidProgram.a_Position < 0 ||
    solidProgram.a_Normal < 0 ||
    !solidProgram.u_MvpMatrix ||
    !solidProgram.u_NormalMatrix ||
    texProgram.a_Position < 0 ||
    texProgram.a_Normal < 0 ||
    texProgram.a_TexCoord < 0 ||
    !texProgram.u_MvpMatrix ||
    !texProgram.u_NormalMatrix ||
    !texProgram.u_Sampler
  ) {
    console.log('Failed to get the storage location of attribute or uniform variable');
    return;
  }

  // Set the vertex information
  const cube = initVertexBuffer(gl);
  if (!cube) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set texture
  const texture = initTextures(gl, texProgram);
  if (!texture) {
    console.log('Failed to initialize the texture.');
    return;
  }

  // Set the clear color and enable the depth test
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Calculate the view projection matrix
  const viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(30.0, ele.width / ele.height, 1.0, 100.0);
  viewProjMatrix.lookAt(0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  // Start drawing
  let currentAngle = 0.0; // Current rotation angle (degrees)
  const tick = function () {
    currentAngle = animate(currentAngle); // Update current rotation angle

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear color and depth buffers
    // Draw a cube in single color
    drawSolidCube(gl, solidProgram, cube, -2.0, currentAngle, viewProjMatrix);
    // Draw a cube with texture
    drawTexCube(gl, texProgram, cube, texture, 2.0, currentAngle, viewProjMatrix);

    window.requestAnimationFrame(tick);
  };
  tick();
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
  const vertices = new Float32Array([   // Vertex coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
  ]);
  /* prettier-ignore */

  /* prettier-ignore */
  const normals = new Float32Array([   // Normal
     0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,     // v0-v1-v2-v3 front
     1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,     // v0-v3-v4-v5 right
     0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,     // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,     // v1-v6-v7-v2 left
     0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,     // v7-v4-v3-v2 down
     0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0      // v4-v7-v6-v5 back
  ]);
  /* prettier-ignore */

  /* prettier-ignore */
  const texCoords = new Float32Array([   // Texture coordinates
     1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
     0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
     1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
     1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
     0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
     0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
  ]);
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

  const o: Record<string, any> = new Object(); // Utilize Object to to return multiple buffer objects together

  // Write vertex information to buffer object
  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  o.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
  o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  if (!o.vertexBuffer || !o.normalBuffer || !o.texCoordBuffer || !o.indexBuffer) return null;

  o.numIndices = indices.length;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}

function initTextures(gl: WebGL2RenderingContext, program: any) {
  const texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return null;
  }

  const image = new Image(); // Create a image object
  if (!image) {
    console.log('Failed to create the image object');
    return null;
  }
  // Register the event handler to be called when image loading is completed
  image.addEventListener('load', function () {
    // Write the image data to texture object
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image Y coordinate
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Pass the texture unit 0 to u_Sampler
    gl.useProgram(program);
    gl.uniform1i(program.u_Sampler, 0);

    gl.bindTexture(gl.TEXTURE_2D, null); // Unbind texture
  });

  // Tell the browser to load an Image
  image.src = '/resources/orange.jpg';

  return texture;
}

function drawSolidCube(
  gl: WebGL2RenderingContext,
  program: any,
  o: Record<string, any>,
  x: number,
  angle: number,
  viewProjMatrix: Matrix4,
) {
  gl.useProgram(program); // Tell that this program object is used

  // Assign the buffer objects and enable the assignment
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer); // Vertex coordinates
  initAttributeVariable(gl, program.a_Normal, o.normalBuffer); // Normal
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer); // Bind indices

  drawCube(gl, program, o, x, angle, viewProjMatrix); // Draw
}

function drawTexCube(
  gl: WebGL2RenderingContext,
  program: any,
  o: Record<string, any>,
  texture: WebGLTexture,
  x: number,
  angle: number,
  viewProjMatrix: Matrix4,
) {
  gl.useProgram(program); // Tell that this program object is used

  // Assign the buffer objects and enable the assignment
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer); // Vertex coordinates
  initAttributeVariable(gl, program.a_Normal, o.normalBuffer); // Normal
  initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer); // Texture coordinates
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer); // Bind indices

  // Bind texture object to texture unit 0
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  drawCube(gl, program, o, x, angle, viewProjMatrix); // Draw
}

// Assign the buffer objects and enable the assignment
function initAttributeVariable(gl: WebGL2RenderingContext, a_attribute: any, buffer: any) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}

function initArrayBufferForLaterUse(
  gl: WebGL2RenderingContext,
  data: Float32Array,
  num: number,
  type: number,
) {
  const buffer = gl.createBuffer(); // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }

  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Keep the information necessary to assign to the attribute variable later
  buffer.num = num;
  buffer.type = type;

  return buffer;
}

// Coordinate transformation matrix
const g_modelMatrix = new Matrix4();
const g_mvpMatrix = new Matrix4();
const g_normalMatrix = new Matrix4();

function drawCube(
  gl: WebGL2RenderingContext,
  program: any,
  o: any,
  x: number,
  angle: number,
  viewProjMatrix: Matrix4,
) {
  // Calculate a model matrix
  g_modelMatrix.setTranslate(x, 0.0, 0.0);
  g_modelMatrix.rotate(20.0, 1.0, 0.0, 0.0);
  g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);

  // Calculate transformation matrix for normals and pass it to u_NormalMatrix
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);

  // Calculate model view projection matrix and pass it to u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

  gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0); // Draw
}

function initElementArrayBufferForLaterUse(
  gl: WebGL2RenderingContext,
  data: Uint8Array,
  type: number,
) {
  const buffer = gl.createBuffer(); // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

  buffer.type = type;

  return buffer;
}

const ANGLE_STEP = 30; // The increments of rotation angle (degrees)

let last = Date.now(); // Last time that this function was called
function animate(angle: number) {
  const now = Date.now(); // Calculate the elapsed time
  const elapsed = now - last;
  last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  const newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle % 360;
}
