import { scene } from './scene';
import { cube } from './cube';
import { light } from './light';
import { camera } from './camera';
import { renderer } from './renderer';

scene.add(cube);
scene.add(light);

function render(time: number) {
  time *= 0.001;

  cube.rotation.x = time;
  cube.rotation.y = time;

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);

export { renderer };
