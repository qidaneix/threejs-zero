import * as THREE from "three";

export class BoxxGeometry extends THREE.BufferGeometry {
  constructor(width: number, height: number, depth: number) {
    super();
    // 8个点
    /* prettier-ignore */
    const vertices = new Float32Array([
        width/2, height/2, depth/2,
        -width/2, height/2, depth/2,
        width/2, -height/2, depth/2,
        width/2, height/2, -depth/2,
        -width/2, -height/2, depth/2,
        width/2, -height/2, -depth/2,
        -width/2, height/2, -depth/2,
        -width/2, -height/2, -depth/2
    ]);
    /* prettier-ignore */
    // 顶点索引
    const indices = [
        0, 1, 2,
        1, 4, 2,
        0, 2, 3,
        2, 5, 3,
        3, 5, 6,
        6, 5, 7,
        1, 6, 4,
        4, 6, 7,
        2, 7, 5,
        4, 7, 2,
        0, 3, 6,
        0, 6, 1
    ]
    this.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    this.setIndex(indices);
  }
}
