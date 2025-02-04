import * as THREE from "three";
import { gui } from "./gui";

export function createTwoRelatedCube() {
  // 几何体
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

  const material0 = new THREE.MeshBasicMaterial({
    color: 0x00ff00, // green
  });
  const material1 = new THREE.MeshBasicMaterial({
    color: 0xff0000, // green
  });
  const material2 = new THREE.MeshBasicMaterial({
    color: 0x0000ff, // green
  });
  const material3 = new THREE.MeshBasicMaterial({
    color: 0xffff00, // green
  });
  const material4 = new THREE.MeshBasicMaterial({
    color: 0xff00ff, // green
  });
  const material5 = new THREE.MeshBasicMaterial({
    color: 0x00ffff, // green
  });

  // 材质
  const parentMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000, // red
    wireframe: true, // 线框
  });
  // 网格
  const parentCube = new THREE.Mesh(boxGeometry, [
    material0,
    material1,
    material2,
    material3,
    material4,
    material5,
  ]);
  parentCube.position.set(-3, 0, 0); // 移动
  parentCube.scale.set(2, 2, 2); // 缩放
  // parentCube.rotation.x = Math.PI / 4; // 旋转

  const subMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // green
  const subCube = new THREE.Mesh(boxGeometry, subMaterial);
  parentCube.add(subCube);
  subCube.position.set(3, 0, 0); // 移动
  subCube.scale.set(0.5, 0.5, 0.5); // 缩放
  // cube.rotation.x = Math.PI / 2; // 旋转

  console.log("boxGeometry", boxGeometry);

  // update gui
  const folder = gui.addFolder("cube");
  folder.add(parentCube.position, "x", -10, 10).name("x");
  folder.add(parentCube.position, "y", -10, 10).name("y");
  folder.add(parentCube.position, "z", -10, 10).name("z");
  gui.add(parentMaterial, "wireframe").name("线框模式");
  gui.addColor(parentMaterial, "color").name("颜色");

  return parentCube;
}
