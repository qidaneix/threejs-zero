import { scene } from './scene';
import { cubes } from './makeInstance';
import { light } from './light';
import { camera } from './camera';
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

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);

export { renderer };
