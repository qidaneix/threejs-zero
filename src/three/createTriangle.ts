import * as THREE from "three";

export function createTriangle() {
  // 创建几何体
  const geometry = new THREE.BufferGeometry();

  // 创建顶点数据。**顶点之于面是有顺序的，顺时针为背面，逆时针为正面**，背面是看不到的；之于线框是无序的
  const vertices = new Float32Array([
    -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
  ]);
  // 设置顶点数据
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  // 创建索引
  const indices = new Uint8Array([0, 1, 2, 2, 3, 0]);
  // 设置索引数据
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  // 顶点分组：设置两个顶点组，形成两个材质
  geometry.addGroup(0, 3, 0);
  geometry.addGroup(3, 3, 1);

  const material0 = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  }); // blue
  const material1 = new THREE.MeshBasicMaterial({
    color: 0xff0000,
  }); // blue
  const triangle = new THREE.Mesh(geometry, [material0, material1]);
  console.log(geometry);
  console.log(triangle);
  return triangle;
}
