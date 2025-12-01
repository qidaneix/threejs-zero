export function initCanvas(container: HTMLElement) {
  const width = 400;
  const height = 400;
  const ele = document.createElement('canvas');
  ele.width = width;
  ele.height = height;
  ele.style.width = width + 'px';
  ele.style.height = height + 'px';
  container.replaceChildren(ele);
  return ele;
}
