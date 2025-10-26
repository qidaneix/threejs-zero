import { initCanvas } from './init-canvas';
import { initVertexBuffers } from './init-vertex-buffers';

// Vertex shader program
const VSHADER_SOURCE = /* glsl */ `
  attribute vec4 a_Position;
  uniform vec4 u_Translation;
  void main() {
    gl_Position = a_Position + u_Translation;
  }
`;

// Fragment shader program
const FSHADER_SOURCE = /* glsl */ `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`;

const Tx = 0.5,
  Ty = 0.5,
  Tz = 0.0;

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

  // 设置顶点位置
  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // 将平移举例传输给顶点着色器
  const u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
  if (!u_Translation) {
    console.log('Failed to get the storage location of u_Translation');
    return;
  }
  gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 绘制三个点
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
