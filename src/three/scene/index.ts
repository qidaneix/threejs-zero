import * as THREE from 'three';
import { light } from './light';
import { axesHelper } from './helper/axes';
import { gridHelper } from './helper/grid';
// import { transformControls } from '../controls/transform';

// 场景
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

scene.add(axesHelper, gridHelper, light);
// scene.add(transformControls.getHelper());
