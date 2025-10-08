import * as THREE from 'three';

// 屏幕空间距离过滤函数
// 优化1：基础屏幕距离过滤
export function filterByScreenDistance(
  intersection: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>,
  camera: THREE.PerspectiveCamera,
  event: MouseEvent,
  domElement: HTMLDivElement,
  maxScreenDistance = 5,
) {
  const { width, height, left, top } = domElement.getBoundingClientRect();
  const mouse = new THREE.Vector2(event.clientX - left, event.clientY - top);

  // 将交点转换为屏幕坐标
  const screenPos = new THREE.Vector3()
    .copy(intersection.point)
    .project(camera); // 转换到标准化设备坐标（NDC）

  // 转换为屏幕像素坐标
  screenPos.x = (screenPos.x * 0.5 + 0.5) * width;
  screenPos.y = (-screenPos.y * 0.5 + 0.5) * height;

  // 计算与鼠标的欧氏距离
  const distance = Math.hypot(screenPos.x - mouse.x, screenPos.y - mouse.y);

  // 只保留距离小于阈值的交点
  return distance <= maxScreenDistance;
}

// 优化2：动态阈值过滤（基于距离）
export function filterByDynamicThreshold(
  intersection: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>,
  camera: THREE.PerspectiveCamera,
  event: MouseEvent,
  domElement: HTMLDivElement,
) {
  const { width, height, left, top } = domElement.getBoundingClientRect();
  const mouse = new THREE.Vector2(event.clientX - left, event.clientY - top);

  // 动态阈值调整（根据距离）
  function getDynamicThreshold(distanceToCamera: number) {
    // 距离越远，阈值越小（要求更精确）
    // 可根据实际场景调整公式
    return Math.max(2, 10 / (distanceToCamera * 0.1));
  }

  const distance = camera.position.distanceTo(intersection.object.position);
  const threshold = getDynamicThreshold(distance);

  // 重新计算该阈值下的距离
  const screenPos = new THREE.Vector3()
    .copy(intersection.point)
    .project(camera);
  screenPos.x = (screenPos.x * 0.5 + 0.5) * width;
  screenPos.y = (-screenPos.y * 0.5 + 0.5) * height;

  const distanceToMouse = Math.hypot(
    screenPos.x - mouse.x,
    screenPos.y - mouse.y,
  );

  return distanceToMouse <= threshold;
}

export function filterIntersections(
  intersections: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[],
  camera: THREE.PerspectiveCamera,
  event: MouseEvent,
  domElement: HTMLDivElement,
  maxScreenDistance = 5,
) {
  const filteredIntersections = intersections.filter((i) => {
    // 非THREE.Line，直接运行
    if (!(i instanceof THREE.Line)) return true;

    return (
      filterByScreenDistance(i, camera, event, domElement, maxScreenDistance) &&
      filterByDynamicThreshold(i, camera, event, domElement)
    );
  });

  return filteredIntersections;
}
