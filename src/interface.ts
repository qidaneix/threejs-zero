import * as THREE from 'three';
import { Cuboid } from './three/object/Cuboid';
import { Polyline } from './three/object/Polyline';

export enum EMode {
  select = 'select',
  drawPolyline = 'drawPolyline',
  drawCuboid = 'drawCuboid',

  translate = 'translate',
  rotate = 'rotate',
  scale = 'scale',
}

export enum EObject {
  polyline,
  cuboid,
}

export type IAnno = Cuboid | Polyline;

export type IPoint = [number, number, number];

export type I4Points = [IPoint, IPoint, IPoint, IPoint];

export type I4Vector4s = [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3];
