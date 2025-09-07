import * as THREE from 'three';
import { geometry } from './geometry';
import { material } from './material';

export const octahedron = new THREE.Mesh(geometry, material);
