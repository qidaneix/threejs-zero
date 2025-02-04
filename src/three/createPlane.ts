import * as THREE from "three";
import { gui } from "./gui";
import kar from "../images/karltao.png";
import dva from "../images/dva.jpg";
import env from "../images/env.jpg";

export function createPlane() {
  // 纹理加载器
  const textureLoader = new THREE.TextureLoader();
  // 加载纹理
  const texture = textureLoader.load(kar);

  const aoMap = textureLoader.load(dva);
  const alphaMap = textureLoader.load(dva);
  const lightMap = textureLoader.load(dva);

  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: texture,
    side: THREE.DoubleSide,
    // 允许透明度
    transparent: true,
    // 设置ao贴图
    // aoMap: aoMap,
    // 设置alpha贴图
    // alphaMap: alphaMap,
    // 设置光照贴图
    lightMap: lightMap,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  gui.add(planeMaterial, "aoMapIntensity").min(0).max(1).name("ao强度");
  return plane;
}
