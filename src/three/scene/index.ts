import * as THREE from 'three';
// import { box } from './mesh/box';
// import { cube } from './mesh/cube';
// import { octahedron } from './object3D/octahedron';
// import { tetrahedron } from './mesh/tetrahedron';
import { sprite } from './object3D/sprite';
import { light } from './light';
import { axesHelper } from './helper/axes';
import { gridHelper } from './helper/grid';
import { transformControls } from '../controls/transform';

// 场景
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

transformControls.attach(sprite);
scene.add(sprite, axesHelper, gridHelper, light);
scene.add(transformControls.getHelper());
