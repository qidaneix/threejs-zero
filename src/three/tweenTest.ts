import * as TWEEN from "three/examples/jsm/libs/tween.module.js";
import * as THREE from "three";

// **补间动画**
export function tweenTest(scene: THREE.Scene) {
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff00ff })
  );
  sphere.position.x = -4;
  scene.add(sphere);

  const tween = new TWEEN.Tween(sphere.position);
  tween.to({ x: 4 }, 1000);
  //   tween.yoyo(true);
  tween.easing(TWEEN.Easing.Quadratic.InOut);
  //   tween.repeat(Infinity);

  const tween2 = new TWEEN.Tween(sphere.position);
  tween2.to({ y: -4 }, 1000);
  tween2.easing(TWEEN.Easing.Quadratic.InOut);

  tween.chain(tween2);
  tween2.chain(tween);

  tween.start();
}
