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
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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

  const g_points: number[] = [];
  ele.addEventListener('click', (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e?.target?.getBoundingClientRect();
    const x = (clientX - left - width / 2) / (width / 2);
    const y = (height / 2 - (clientY - top)) / (height / 2);
    console.log(x, y);

    g_points.push(x, y);

    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < g_points.length; i += 2) {
      gl.vertexAttrib2f(a_Position, g_points[i], g_points[i + 1]);

      gl.drawArrays(gl.POINTS, 0, 1);
    }
  });

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}
