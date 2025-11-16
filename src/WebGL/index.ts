import { initCanvas } from './init-canvas';
import { initVertexBuffers } from './init-vertex-buffers';

// Vertex shader program
const VSHADER_SOURCE = /* glsl */ `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  void main() {
    gl_Position = u_ModelMatrix * a_Position;
  }
`;

// Fragment shader program
const FSHADER_SOURCE = /* glsl */ `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

const angle_step = 45;

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

  gl.clearColor(0, 0, 0, 1);

  // 将旋转矩阵传输给顶点着色器
  const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix');
    return;
  }

  let currentAngle = 0;

  // 创建变换矩阵
  const modelMatrix = new Matrix4();

  const tick = () => {
    currentAngle = animate(currentAngle);
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
    requestAnimationFrame(tick, ele);
  };
  tick();
}

function draw(
  gl: WebGL2RenderingContext,
  n: number,
  currentAngle: number,
  modelMatrix: Matrix4,
  u_ModelMatrix: WebGLUniformLocation,
) {
  modelMatrix.setRotate(currentAngle, 0, 0, 1);

  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

let g_last = Date.now();
function animate(angle: number) {
  const now = Date.now();
  const elapsed = now - g_last;
  g_last = now;
  const newAngle = angle + (angle_step * elapsed) / 1000.0;
  return newAngle % 360;
}
