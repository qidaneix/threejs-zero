import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { camera } from '../../camera';
import { renderer } from '../../renderer';
import { orbitControls } from '../orbit';

const { domElement } = renderer;

// 变换控制器
export const transformControls = new TransformControls(camera, domElement);

// 当开始/结束拖拽变换控件时，禁用/启用轨道控制器
transformControls.addEventListener('dragging-changed', function (event) {
  orbitControls.enabled = !event.value;
});

transformControls.addEventListener('object-changed', function (event) {
  console.log('run', event);
});

// transformControls.addEventListener(
//   'change',
//   debounce(function () {
//     // 这里的代码会在用户完成一次变换操作后执行
//     const controlledObject = transformControls.object;

//     if (!controlledObject) return;

//     // 获取位置数据（局部坐标）
//     const position = controlledObject.position;
//     console.log(
//       '位置:',
//       `x: ${position.x.toFixed(2)}, y: ${position.y.toFixed(2)}, z: ${position.z.toFixed(2)}`,
//     );

//     // 获取旋转数据（弧度）
//     const rotation = controlledObject.rotation;
//     // 旋转数据（角度）
//     console.log(
//       '旋转（角度）:',
//       `x: ${THREE.MathUtils.radToDeg(rotation.x).toFixed(2)},
//              y: ${THREE.MathUtils.radToDeg(rotation.y).toFixed(2)},
//              z: ${THREE.MathUtils.radToDeg(rotation.z).toFixed(2)}`,
//     );

//     // 获取缩放数据
//     const scale = controlledObject.scale;
//     console.log(
//       '缩放:',
//       `x: ${scale.x.toFixed(2)}, y: ${scale.y.toFixed(2)}, z: ${scale.z.toFixed(2)}`,
//     );

//     console.log(controlledObject);
//   }, 1000),
// );
