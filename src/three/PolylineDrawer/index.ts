import * as THREE from 'three';
import { scene } from '../scene';
import { nanoid } from 'nanoid';
import { DataBase } from '../../DataBase';

export class PolylineDrawer {
  private line: THREE.Line;

  constructor(initPoint: THREE.Vector3) {
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(
        new Float32Array([initPoint.x, initPoint.y, initPoint.z]),
        3,
      ),
    );
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    this.line = new THREE.Line(lineGeometry, lineMaterial);
    // this.points = new THREE.Points();
    scene.add(this.line);
  }

  public updateLastPoint(point: THREE.Vector3) {
    const geometry = this.line.geometry;
    const positions = geometry.attributes.position.array;

    const newPositions = new Float32Array([
      ...positions.slice(0, positions.length - 3),
      point.x,
      point.y,
      point.z,
    ]);
    // 更新
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(newPositions, 3),
    );
  }

  public addPoint(point: THREE.Vector3) {
    const geometry = this.line.geometry;
    const positions = geometry.attributes.position.array;
    const newPositions = new Float32Array([
      ...positions,
      point.x,
      point.y,
      point.z,
    ]);
    // 加点
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(newPositions, 3),
    );
  }

  public finish() {
    const array = this.line.geometry.attributes.position.array;
    DataBase.insert({
      id: nanoid(6),
      points: array,
    });
  }

  public dispose() {
    scene.remove(this.line);
  }
}
