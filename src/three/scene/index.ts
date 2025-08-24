import * as THREE from "three";
import { cube } from "./mesh/cube";
import { light } from "./light";
import { axesHelper } from "./axesHelper";

// 场景
export const scene = new THREE.Scene();

scene.add(cube, axesHelper, light);
