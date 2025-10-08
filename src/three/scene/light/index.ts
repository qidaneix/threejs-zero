import * as THREE from 'three';

const color = 0xffffff;
const intensity = 1;

// 灯光
export const light = new THREE.DirectionalLight(color, intensity);

light.position.set(-3, 4, 5);
light.lookAt(0, 0, 0);
