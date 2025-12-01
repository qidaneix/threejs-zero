import { initCanvas } from './init-canvas';
import { initVertexBuffers } from './init-vertex-buffers';

// Vertex shader program
const VSHADER_SOURCE = /* glsl */ `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ViewMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_ViewMatrix * a_Position;
    v_Color = a_Color;
  }
`;

// Fragment shader program
const FSHADER_SOURCE = /* glsl */ `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`;

export function main(container: HTMLDivElement) {
  const ele = initCanvas(container);

  const gl = ele.getContext?.('webgl2');
  if (!gl) {
    ele.innerText = '当前浏览器不支持 WebGL2，请更换浏览器后重试';
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // set the vertex coordinates and color
  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // get the storage location of u_ViewMatrix
  const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // set the matrix to be used for to set the camera view
  const viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.2, 0.25, 0.25, 0, 0, 0, 0, 1, 0);

  // set the view matrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  // clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // draw the triangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
