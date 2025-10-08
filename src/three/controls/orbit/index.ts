import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { camera } from '../../camera';
import { renderer } from '../../renderer';

const { domElement } = renderer;

// 轨道控制器
export const orbitControls = new OrbitControls(camera, domElement);
orbitControls.enableDamping = true;
