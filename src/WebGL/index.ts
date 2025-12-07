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

  // get the storage location of u_FragColor
  const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  ele.addEventListener('mousedown', function (ev) {
    click(ev, gl, ele, a_Position, u_FragColor);
  });

  // specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

const g_points: [number, number][] = []; // The array for the position of a mouse press
const g_colors: [number, number, number, number][] = []; // The array to store the color of a point
function click(
  ev: MouseEvent,
  gl: WebGL2RenderingContext,
  canvas: HTMLCanvasElement,
  a_Position: number,
  u_FragColor: WebGLUniformLocation,
) {
  const x = ev.clientX; // x coordinate of a mouse pointer
  const y = ev.clientY; // y coordinate of a mouse pointer
  const rect = ev.target.getBoundingClientRect();

  const standX = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  const standY = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  // Store the coordinates to g_points array
  g_points.push([standX, standY]);
  // Store the coordinates to g_colors array
  if (standX >= 0 && standY >= 0) {
    g_colors.push([1, 0, 0, 1]); // red
  } else if (standX < 0 && standY < 0) {
    g_colors.push([0, 1, 0, 1]); // green
  } else {
    g_colors.push([1, 1, 1, 1]); //white
  }

  // clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (let i = 0; i < g_points.length; i += 1) {
    const xy = g_points[i];
    const rgba = g_colors[i];

    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // draw a point
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
