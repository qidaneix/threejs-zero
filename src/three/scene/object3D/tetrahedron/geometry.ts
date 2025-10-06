import { TetrahedronGeometry } from '../../../geometrys/TetrahedronGeometry';
import * as THREE from 'three';

const p0 = new THREE.Vector3(1, 1, 1);
const p1 = new THREE.Vector3(-2, -2, 2);
const p2 = new THREE.Vector3(1, -1, -1);
const p3 = new THREE.Vector3(-2, 2, 2);
export const geometry = new TetrahedronGeometry([p0, p1, p2, p3]);
