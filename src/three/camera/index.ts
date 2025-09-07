import * as THREE from 'three';

// 透视相机
const fov = 75; // 视野范围，单位是度数
const aspect = document.body.clientWidth / document.body.clientHeight; // 画布宽高比
const near = 0.1; // 近裁剪面
const far = 1000; // 远裁剪面
export const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// 相机位置
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);
