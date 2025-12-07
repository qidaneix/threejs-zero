import { initCanvas } from './init-canvas';

export function main(container: HTMLDivElement) {
  const ele = initCanvas(container);

  const gl = ele.getContext?.('webgl2');
  if (!gl) {
    ele.innerText = '当前浏览器不支持 WebGL2，请更换浏览器后重试';
    return;
  }

  // specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}
