import * as THREE from 'three';

export class TetrahedronGeometry extends THREE.BufferGeometry {
  constructor(
    points: [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3],
  ) {
    super();
    // 顶点4个
    const [p0, p1, p2, p3] = points;
    /* prettier-ignore */
    const vertices = new Float32Array([
      p0.x, p0.y, p0.z,
      p1.x, p1.y, p1.z,
      p2.x, p2.y, p2.z,
      p3.x, p3.y, p3.z
    ]);
    // 索引
    const indices = [0, 2, 3, 1, 3, 2, 2, 0, 1, 3, 1, 0];
    this.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    this.setIndex(indices);
  }
}
