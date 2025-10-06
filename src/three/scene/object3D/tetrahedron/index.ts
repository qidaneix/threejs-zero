import * as THREE from 'three';
import { geometry } from './geometry';
import { material } from './material';

export const tetrahedron = new THREE.Mesh(geometry, material);
tetrahedron.position.set(-5, -5, 5);
