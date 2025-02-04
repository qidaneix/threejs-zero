import * as THREE from "three";

// 光线投射实现3D场景交互
export function rayCasterTest(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) {
  // 三球
  const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
  const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
  );
  sphere1.position.set(0, 0, 0);
  sphere2.position.set(4, 0, 0);
  sphere3.position.set(-4, 0, 0);
  scene.add(sphere1);
  scene.add(sphere2);
  scene.add(sphere3);

  window.addEventListener("click", (e) => {
    // **创建射线**
    const raycaster = new THREE.Raycaster();

    const { clientX, clientY } = e;
    console.log(clientX, clientY);

    // 二维向量保存鼠标保存位置
    const mouse = new THREE.Vector2();
    // **归一化**，x轴左至右[-1,1]，y轴下至上[-1,1]
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    console.log(mouse);

    // 射线
    raycaster.setFromCamera(mouse, camera);
    // 交点
    const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3]);
    console.log(intersects);
    if (!intersects.length) return;

    const intersect = intersects[0];
    const { object } = intersect;
    if (object.__isSelected) {
      object.__isSelected = false;
      object.material.color.set(object.__originColor);
    } else {
      object.__isSelected = true;
      object.__originColor = (object.material.color as THREE.Color).getHex();
      object.material.color.set(0xffffff);
    }
  });
}
