import * as THREE from "three";
import { geometry } from "./geometry";
import { material } from "./material";

export const cubee = new THREE.Mesh(geometry, material);
cubee.position.set(2, 2, 2);
window.cubee = cubee;
