import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { camera } from '../camera';
import { renderer } from '../renderer';

const { domElement } = renderer;

// 轨道控制器
export const controls = new OrbitControls(camera, domElement);
controls.enableDamping = true;
