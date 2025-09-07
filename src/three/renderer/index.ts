import * as THREE from 'three';

// 渲染器
export const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(document.body.clientWidth, document.body.clientHeight);
console.log('window.devicePixelRatio', window.devicePixelRatio);
renderer.setPixelRatio(window.devicePixelRatio);
