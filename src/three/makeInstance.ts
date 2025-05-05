import * as THREE from 'three';
import { geometry } from './geometry';

function makeInstance(
  geometry: THREE.BufferGeometry,
  color: number,
  x: number,
) {
  const material = new THREE.MeshPhongMaterial({ color });

  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = x;

  return cube;
}

export const cubes = [
  makeInstance(geometry, 0x44aa88, 0),
  makeInstance(geometry, 0x8844aa, -2),
  makeInstance(geometry, 0xaa8844, 2),
];
