import * as THREE from 'three';

/**
 * @deprecated
 * 计算射线与平面的交点
 * @param {THREE.Ray} ray 射线（使用 THREE.Ray 实例，包含起点和方向向量）
 * @param {THREE.Plane} plane 平面（使用 THREE.Plane 实例，包含法向量和常数项）
 * @param {number} epsilon 精度阈值（默认 1e-6）
 * @returns {THREE.Vector3|null} 交点（若平行且在平面上返回起点，无交点返回 null）
 */
export function findLinePlaneIntersection(
  ray: THREE.Ray,
  plane: THREE.Plane,
  epsilon = 1e-6,
) {
  // 直线起点（克隆避免修改原数据）
  const lineStart = ray.origin.clone();
  // 直线方向向量（克隆避免修改原数据）
  const lineDir = ray.direction.clone();

  // 平面法向量（克隆避免修改原数据）
  const planeNormal = plane.normal.clone();
  // 平面常数项
  const planeConstant = plane.constant;

  // 计算分母：平面法向量与直线方向向量的点积
  const dotNV = planeNormal.dot(lineDir);

  // 判断是否平行（点积接近 0）
  if (Math.abs(dotNV) < epsilon) {
    // 计算分子：平面法向量与直线起点的点积 + 平面常数项
    const dotNP0 = planeNormal.dot(lineStart) + planeConstant;

    // 若分子也接近 0，直线在平面上，返回起点（或其他点）
    if (Math.abs(dotNP0) < epsilon) {
      return lineStart.clone();
    } else {
      // 平行但不相交
      return null;
    }
  } else {
    // 计算参数 t
    const numerator = planeNormal.dot(lineStart) + planeConstant;
    const t = -numerator / dotNV;

    // 计算交点坐标（直线起点 + 方向向量 * t）
    const intersection = new THREE.Vector3()
      .copy(lineStart)
      .addScaledVector(lineDir, t);
    return intersection;
  }
}
