import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js"; // 轨道控制器
import * as TWEEN from "three/examples/jsm/libs/tween.module.js";
import { createTwoRelatedCube } from "./createTwoRelatedCube";
import { createTriangle } from "./createTriangle";
import { createPlane } from "./createPlane";
import { rayCasterTest } from "./rayCasterTest";
import { tweenTest } from "./tweenTest";
import { uvTest } from "./uvTest";

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
export const { domElement } = renderer;

// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// 添加控制器
const controls = new OrbitControls(camera, domElement);
controls.enableDamping = true;

// 场景
const scene = new THREE.Scene();

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

// const parentCube = createTwoRelatedCube();
// scene.add(parentCube);

// const triangle = createTriangle();
// scene.add(triangle);

// const plane = createPlane();
// scene.add(plane);

// rayCasterTest(scene, camera);

// tweenTest(scene);

uvTest(scene);

function animate() {
  requestAnimationFrame(animate);
  // parentCube.rotation.y += 0.01;
  // parentCube.rotation.z += 0.01;

  controls.update();
  TWEEN.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  // 更新渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 更新相机的宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix();
});
