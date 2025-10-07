import * as THREE from 'three';
import { objectsGroup } from '../../scene/group';
import { nanoid } from 'nanoid';
import { DataBase } from '../../../DataBase';
import { Polyline } from '../Polyline';
import type { IPoint } from '../../../interface';
import { EObject } from '../../../interface';
import { drawersGroup } from '../../scene/group';

export class PolylineDrawer {
  private line: THREE.Line;

  private points: THREE.Points;

  constructor(initPoint: THREE.Vector3) {
    const geometry = this.createGeometry(initPoint);

    const lineMaterial = this.createLineMaterial();
    this.line = new THREE.Line(geometry, lineMaterial);

    const pointsMaterial = this.createPointsMaterial();
    this.points = new THREE.Points(geometry, pointsMaterial);

    drawersGroup.add(this.line, this.points);
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
    geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
  }

  public addPoint(point: THREE.Vector3) {
    const geometry = this.line.geometry;
    const positions = geometry.attributes.position.array;
    const newPositions = new Float32Array([...positions, point.x, point.y, point.z]);
    // 加点
    geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
  }

  public finish() {
    const positionAttr = this.line.geometry.attributes.position;
    const points: IPoint[] = [];
    for (let i = 0; i < positionAttr.count - 1; i += 1) {
      points.push([positionAttr.getX(i), positionAttr.getY(i), positionAttr.getZ(i)]);
    }

    const id = nanoid(6);
    DataBase.insert({
      id,
      points,
      type: EObject.polyline,
    });
    const polyline = Polyline.create({ id, points });
    objectsGroup.add(polyline.getLine());
    return polyline;
  }

  public dispose() {
    drawersGroup.remove(this.line, this.points);
  }

  private createGeometry(point: THREE.Vector3) {
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([point]);

    return geometry;
  }

  private createLineMaterial() {
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    return material;
  }

  private createPointsMaterial() {
    const material = new THREE.PointsMaterial({ color: 0xff0000, size: 0.1 });
    return material;
  }
}
