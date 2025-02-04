import * as THREE from "three";
import dva from "../images/dva.jpg";

export function uvTest(scene: THREE.Scene) {
  const uvTexture = new THREE.TextureLoader().load(dva);

  // 无uv属性
  const geometry = new THREE.BufferGeometry();

  const vertices = new Float32Array([
    -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
  ]);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  const indices = new Uint8Array([0, 1, 2, 2, 3, 0]);
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  const uv = new Float32Array([0, 0, 0, 0, 1, 1, 0, 1]);
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));

  const material = new THREE.MeshBasicMaterial({
    // color: 0x00ffff,
    map: uvTexture,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(3, 0, 0);
  console.log("mash", mesh);
  scene.add(mesh);

  // 有uv属性
  const planeGeometry = new THREE.PlaneGeometry(2, 2);
  const planeMaterial = new THREE.MeshBasicMaterial({
    // color: 0xffff00,
    map: uvTexture,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(-3, 0, 0);
  console.log("plane", plane);
  scene.add(plane);
}
