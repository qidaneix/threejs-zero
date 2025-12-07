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

  // get the storage location of a_Position
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  ele.addEventListener('mousedown', function (ev) {
    click(ev, gl, ele, a_Position);
  });

  // specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

const g_points: number[] = []; // The array for the position of a mouse press
function click(
  ev: MouseEvent,
  gl: WebGL2RenderingContext,
  canvas: HTMLCanvasElement,
  a_Position: number,
) {
  const x = ev.clientX; // x coordinate of a mouse pointer
  const y = ev.clientY; // y coordinate of a mouse pointer
  const rect = ev.target.getBoundingClientRect();

  const standX = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  const standY = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  // Store the coordinates to g_points array
  g_points.push(standX);
  g_points.push(standY);

  // clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (let i = 0; i < g_points.length; i += 2) {
    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0);

    // draw a point
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
