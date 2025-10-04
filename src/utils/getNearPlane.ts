import * as THREE from 'three';

// 函数：获取相机的近平面
export function getNearPlane(camera: THREE.PerspectiveCamera) {
  // 获取相机的世界方向
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  // 计算近平面上的一点（相机位置沿视线方向移动near距离）
  const planePoint = new THREE.Vector3();
  planePoint.copy(camera.position).add(direction.multiplyScalar(camera.near));

  // 平面方程: ax + by + cz + d = 0
  // 法向量就是相机的方向向量
  const normal = direction.clone().normalize();

  // 计算d值
  const d = -normal.dot(planePoint);

  // 创建平面实例
  const plane = new THREE.Plane(normal, d);

  return plane;
}
