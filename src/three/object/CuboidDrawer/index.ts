import * as THREE from 'three';
import { objectsGroup } from '../../scene/group';
import { nanoid } from 'nanoid';
import { DataBase } from '../../../DataBase';
import { Cuboid } from '../Cuboid';
import type { I4Points, IPoint } from '../../../interface';
import { EObject } from '../../../interface';
import { drawersGroup } from '../../scene/group';

export class CuboidDrawer {
  private polygon: THREE.Mesh;

  private points: THREE.Points;

  private lineLoop: THREE.LineLoop;

  private readonly defaultHeight = 10;

  constructor(initPoint: THREE.Vector3) {
    const geometry = this.createGeometry(initPoint);

    const planeMaterial = this.createPlaneMaterial();
    this.polygon = new THREE.Mesh(geometry, planeMaterial);

    const lineMaterial = this.createLineMaterial();
    this.lineLoop = new THREE.LineLoop(geometry, lineMaterial);

    const pointsMaterial = this.createPointsMaterial();
    this.points = new THREE.Points(geometry, pointsMaterial);

    drawersGroup.add(this.polygon, this.lineLoop, this.points);
  }

  public updateLastPoint(point: THREE.Vector3) {
    const geometry = this.polygon.geometry;
    const positionArr = geometry.attributes.position.array;
    const { length } = positionArr;

    let verticalPoint: THREE.Vector3;
    if (length > 6) {
      const start = new THREE.Vector3(
        positionArr[length - 6],
        positionArr[length - 5],
        positionArr[length - 4],
      );
      const end = new THREE.Vector3(
        positionArr[length - 3],
        positionArr[length - 2],
        positionArr[length - 1],
      );
      const preVector = new THREE.Vector3().subVectors(end, start);
      const deltaZ = preVector.z;
      const deltaX = preVector.x;
      const verticalVector1 = new THREE.Vector3(-deltaZ, 0, deltaX);
      const verticalVector2 = new THREE.Vector3(deltaZ, 0, -deltaX);
      const ray1 = new THREE.Ray(end, verticalVector1);
      const ray2 = new THREE.Ray(end, verticalVector2);
      ray1.verticalPoint = point.clone();
    } else {
      verticalPoint = point.clone();
    }
    const newPositions = new Float32Array([
      ...positionArr.slice(0, positionArr.length - 3),
      verticalPoint.x,
      verticalPoint.y,
      verticalPoint.z,
    ]);
    // 更新
    geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
  }

  public addPoint(point: THREE.Vector3) {
    const geometry = this.polygon.geometry;
    const positions = geometry.attributes.position.array;
    const newPositions = new Float32Array([...positions, point.x, point.y, point.z]);
    // 加点
    geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
  }

  public finish() {
    const positionAttr = this.polygon.geometry.attributes.position;
    // 前三个点
    const points: IPoint[] = [];
    for (let i = 0; i < 3; i += 1) {
      points.push([positionAttr.getX(i), positionAttr.getY(i), positionAttr.getZ(i)]);
    }
    // 第四个点
    points.push([points[2][0], this.defaultHeight, points[2][2]]);

    const id = nanoid(6);
    DataBase.insert({
      id,
      points,
      type: EObject.cuboid,
    });
    const cuboid = Cuboid.create({ id, points } as { id: string; points: I4Points });
    objectsGroup.add(cuboid.getMash());
    return cuboid;
  }

  public dispose() {
    drawersGroup.remove(this.polygon, this.lineLoop, this.points);
  }

  private createGeometry(point: THREE.Vector3) {
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([point]);

    return geometry;
  }

  private createPlaneMaterial() {
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    return material;
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
