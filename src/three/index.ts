import { renderer } from './renderer';
import { camera } from './camera';
import { scene } from './scene';
import { orbitControls } from './controls/orbit';
import { transformControls } from './controls/transform';

export { renderer };

// 键盘快捷键
document.body.addEventListener('keydown', function (event) {
  if (event.ctrlKey) return;

  switch (event.key.toLowerCase()) {
    case 't': {
      transformControls.setMode('translate');
      break;
    }
    case 'r': {
      transformControls.setMode('rotate');
      break;
    }
    case 's': {
      transformControls.setMode('scale');
      break;
    }
  }
});

// --- 窗口自适应 ---
document.body.addEventListener('resize', function () {
  // 更新相机的宽高比
  camera.aspect = document.body.clientWidth / document.body.clientHeight;
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器尺寸
  renderer.setSize(document.body.clientWidth, document.body.clientHeight);
});

// --- 渲染循环 ---
function animate() {
  if (orbitControls.enabled) orbitControls.update();

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
