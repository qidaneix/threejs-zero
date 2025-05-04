import * as THREE from 'three';
import { geometry } from './geometry';
import { material } from './material';

export const cube = new THREE.Mesh(geometry, material);
