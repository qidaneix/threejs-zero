import { renderer } from './renderer';
import { camera } from './camera';
import { controls } from './controls';
import { scene } from './scene';
import { box } from './scene/mesh/box';

function animate(time: number) {
  // box.rotation.x += 10e-3;
  // box.rotation.y += 10e-3;

  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// 调整窗口大小
document.body.addEventListener('resize', function () {
  // 更新渲染器尺寸
  renderer.setSize(document.body.clientWidth, document.body.clientHeight);
  // 更新相机的宽高比
  camera.aspect = document.body.clientWidth / document.body.clientHeight;
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix();
});

export { renderer };
