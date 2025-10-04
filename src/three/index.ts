import { renderer } from './renderer';
import { camera } from './camera';
import { scene } from './scene';
import { orbitControls } from './controls/orbit';
// import { transformControls } from './controls/transform';

export { renderer };

// TODO:
// // 键盘快捷键
// document.body.addEventListener('keydown', function (event) {
//   if (event.ctrlKey) return;

//   switch (event.key.toLowerCase()) {
//     case 't': {
//       transformControls.setMode('translate');
//       break;
//     }
//     case 'r': {
//       transformControls.setMode('rotate');
//       break;
//     }
//     case 's': {
//       transformControls.setMode('scale');
//       break;
//     }
//   }
// });

// --- 渲染循环 ---
function animate() {
  if (orbitControls.enabled) orbitControls.update();

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
