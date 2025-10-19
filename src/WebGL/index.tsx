import { initCanvas } from './init-canvas';

// Vertex shader program
const VSHADER_SOURCE = /* glsl */ `
  attribute vec4 a_Position;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0;
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

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  const g_points: { x: number; y: number }[] = [];
  ele.addEventListener('click', (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e?.target?.getBoundingClientRect();
    const x = (clientX - left - width / 2) / (width / 2);
    const y = (height / 2 - (clientY - top)) / (height / 2);
    console.log({ x, y });

    g_points.push({ x, y });

    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < g_points.length; i += 1) {
      const { x, y } = g_points[i];

      gl.vertexAttrib2f(a_Position, x, y);

      if (x >= 0.0 && y >= 0.0) {
        gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1);
      } else if (x < 0.0 && y < 0.0) {
        gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1);
      } else if (x >= 0.0 && y < 0.0) {
        gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1);
      } else if (x < 0.0 && y >= 0.0) {
        gl.uniform4f(u_FragColor, 1.0, 1.0, 0.0, 1);
      }

      gl.drawArrays(gl.POINTS, 0, 1);
    }
  });

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}
