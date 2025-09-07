import * as THREE from 'three';
import { box } from './mesh/box';
import { cube } from './mesh/cube';
import { octahedron } from './mesh/octahedron';
import { light } from './light';
import { axesHelper } from './axesHelper';

// 场景
export const scene = new THREE.Scene();

scene.add(box, cube, octahedron, axesHelper, light);
