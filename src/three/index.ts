import { renderer } from './renderer';
import { camera } from './camera';
import { scene } from './scene';
import { orbitControls } from './controls/orbit';
// import { transformControls } from './controls/transform';

export { renderer };

// --- 渲染循环 ---
function animate() {
  if (orbitControls.enabled) orbitControls.update();

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
