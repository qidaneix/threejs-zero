import { scene } from './scene';
import { cubes } from './makeInstance';
import { light } from './light';
import { camera } from './camera';
import { controls } from './controls';
import { renderer } from './renderer';

scene.add(...cubes);
scene.add(light);

function render(time: number) {
  time *= 0.001;

  cubes.forEach((cube, ndx) => {
    const speed = 1 + ndx * 0.1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);

export { renderer };

document.body.addEventListener('resize', function () {
  // 更新渲染器尺寸
  renderer.setSize(document.body.clientWidth, document.body.clientHeight);
  // 更新相机的宽高比
  camera.aspect = document.body.clientWidth / document.body.clientHeight;
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix();
});
