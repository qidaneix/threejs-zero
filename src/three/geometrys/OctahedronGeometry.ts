import * as THREE from 'three';

export class OctahedronGeometry extends THREE.BufferGeometry {
  constructor(
    w1: number,
    w2: number,
    h1: number,
    h2: number,
    d1: number,
    d2: number,
  ) {
    super();
    // 6个顶点
    /* prettier-ignore */
    const vertices = new Float32Array([
      w1, 0, 0,
      -w2, 0, 0,
      0, h1, 0,
      0, -h2, 0,
      0, 0, d1,
      0, 0, -d2
    ]);
    // 顶点索引
    /* prettier-ignore */
    const indices = [
      0, 2, 4,
      0, 4, 3,
      5, 2, 0,
      5, 0, 3,
      1, 2, 5,
      1, 5, 3,
      4, 2, 1,
      4, 1, 3
    ];
    this.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    this.setIndex(indices);
  }
}
