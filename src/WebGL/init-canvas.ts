export function initCanvas(container: HTMLElement) {
  const { width, height } = container.getBoundingClientRect();
  const ele = document.createElement('canvas');
  ele.width = width;
  ele.height = height;
  container.replaceChildren(ele);
  return ele;
}
