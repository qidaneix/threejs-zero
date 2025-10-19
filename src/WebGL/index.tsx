export function main(container: HTMLDivElement) {
  const { width, height } = container.getBoundingClientRect();
  const ele = document.createElement('canvas');
  ele.width = width;
  ele.height = height;
  container.replaceChildren(ele);

  const gl = ele.getContext?.('webgl2');
  if (!gl) {
    ele.innerText = '当前浏览器不支持 WebGL2，请更换浏览器后重试';
    return;
  }

  gl.clearColor(0, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}
