import * as THREE from 'three';
import type { I4Vector4s } from '../interface';

export function computeTransformationMatrix(vertices: I4Vector4s, epsilon = 1e-6) {
  // 确保输入的是4个不共面的顶点
  if (vertices.length !== 4) throw new Error('需要提供4个顶点');

  const [p0, p1, p2, p6] = vertices.map((i) => i.clone());

  // 三条正交的向量
  const v1 = new THREE.Vector3().subVectors(p1, p0);
  const v2 = new THREE.Vector3().subVectors(p6, p2);
  const v3 = new THREE.Vector3().subVectors(p2, p1);

  if ([v1.dot(v2), v2.dot(v3), v3.dot(v1)].some((i) => Math.abs(i) < epsilon)) {
    throw new Error('无法从给定的顶点中找到三个互相垂直的向量，它们可能不构成长方体');
  }

  // 缩放
  const l1 = v1.length(); // 长
  const l2 = v2.length(); // 宽
  const l3 = v3.length(); // 高
  const scaleMatrix = new THREE.Matrix4().makeScale(l1, l2, l3); // 缩放矩阵

  // 旋转
  const u1 = v1.clone().normalize();
  const u2 = v2.clone().normalize();
  const u3 = v3.clone().normalize();
  const rotateMatrix = new THREE.Matrix4().makeBasis(u1, u2, u3);

  // 平移
  //原点
  const O = new THREE.Vector3().addVectors(p6, p0).multiplyScalar(0.5);
  const translateMatrix = new THREE.Matrix4().makeTranslation(O);

  // 构造总变换矩阵T（平移 × 旋转 × 缩放）
  // 先旋转，再平移？不，矩阵乘法是右乘，实际顺序是 S → R → T
  const matrix = new THREE.Matrix4().multiplyMatrices(translateMatrix, rotateMatrix);
  matrix.multiply(scaleMatrix);

  return matrix;
}
