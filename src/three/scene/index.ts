import * as THREE from 'three';
import { light } from './light';
import { axesHelper } from './helper/axes';
import { gridHelper } from './helper/grid';
import { objectsGroup, drawersGroup } from './group';
// import { transformControls } from '../controls/transform';

// 场景
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

scene.add(axesHelper, gridHelper, light, objectsGroup, drawersGroup);
// scene.add(transformControls.getHelper());
