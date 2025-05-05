import * as THREE from 'three';

const fov = 75; // 视野范围
const aspect = document.body.clientWidth / document.body.clientHeight; // 画布宽高比
const near = 0.1; // 近平面
const far = 5; // 远平面
export const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.z = 2;
