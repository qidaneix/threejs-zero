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

  private readonly defaultHeight = 0.5;

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
        positionArr[length - 9],
        positionArr[length - 8],
        positionArr[length - 7],
      );
      const end = new THREE.Vector3(
        positionArr[length - 6],
        positionArr[length - 5],
        positionArr[length - 4],
      );
      verticalPoint = this.getVerticalPoint(start, end, point);
    } else {
      verticalPoint = point.clone();
    }
    const newPositionArr = new Float32Array([
      ...positionArr.slice(0, positionArr.length - 3),
      verticalPoint.x,
      verticalPoint.y,
      verticalPoint.z,
    ]);
    // 更新
    geometry.setAttribute('position', new THREE.BufferAttribute(newPositionArr, 3));
  }

  public addPoint(point: THREE.Vector3) {
    const geometry = this.polygon.geometry;
    const positionArr = geometry.attributes.position.array;
    const { length } = positionArr;

    let verticalPoint: THREE.Vector3;
    if (length > 6) {
      const start = new THREE.Vector3(
        positionArr[length - 9],
        positionArr[length - 8],
        positionArr[length - 7],
      );
      const end = new THREE.Vector3(
        positionArr[length - 6],
        positionArr[length - 5],
        positionArr[length - 4],
      );
      verticalPoint = this.getVerticalPoint(start, end, point);
    } else {
      verticalPoint = point.clone();
    }
    const newPositionArr = new Float32Array([
      ...positionArr,
      verticalPoint.x,
      verticalPoint.y,
      verticalPoint.z,
    ]);
    // 加点
    geometry.setAttribute('position', new THREE.BufferAttribute(newPositionArr, 3));
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

  public getPointsCount() {
    const { position } = this.polygon.geometry.attributes;
    return position.count;
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

  private getVerticalPoint(startP: THREE.Vector3, endP: THREE.Vector3, targetP: THREE.Vector3) {
    const preVector = new THREE.Vector3().subVectors(endP, startP);
    const deltaZ = preVector.z;
    const deltaX = preVector.x;
    const verticalVector1 = new THREE.Vector3(-deltaZ, 0, deltaX).normalize();
    const verticalVector2 = new THREE.Vector3(deltaZ, 0, -deltaX).normalize();
    const ray1 = new THREE.Ray(endP, verticalVector1);
    const ray2 = new THREE.Ray(endP, verticalVector2);

    const vector = new THREE.Vector3().subVectors(targetP, startP).normalize();
    const ray = new THREE.Ray(startP, vector);
    let result: THREE.Vector3;
    const r1 = this.checkIntersection(ray1, ray);
    const r2 = this.checkIntersection(ray2, ray);
    if (r1.intersects) {
      result = r1.point as THREE.Vector3;
    } else if (r2.intersects) {
      result = r2.point as THREE.Vector3;
    } else {
      result = targetP;
    }
    return result;
  }

  private checkIntersection(rayA: THREE.Ray, rayB: THREE.Ray) {
    const epsilon = 1e-10; // 容差，处理浮点精度

    // 提取XZ平面上的2D坐标（忽略Y轴）
    const x1 = rayA.origin.x;
    const z1 = rayA.origin.z;
    const dx1 = rayA.direction.x;
    const dz1 = rayA.direction.z;

    const x2 = rayB.origin.x;
    const z2 = rayB.origin.z;
    const dx2 = rayB.direction.x;
    const dz2 = rayB.direction.z;

    // 计算行列式
    const det = dx2 * dz1 - dx1 * dz2;

    // 检查射线是否平行
    if (Math.abs(det) < epsilon) {
      return {
        intersects: false,
        point: null,
        t1: -1,
        t2: -1,
        reason: '射线平行或重合',
      };
    }

    // 计算参数 t1 和 t2
    const t2 = (dx1 * (z2 - z1) + dz1 * (x1 - x2)) / det;
    const t1 = (x2 + dx2 * t2 - x1) / dx1;

    // 检查参数有效性（射线方向性）
    if (t1 >= 0 && t2 >= 0) {
      // 计算3D交点（Y坐标为0，因为在XZ平面）
      const point = new THREE.Vector3(x1 + t1 * dx1, 0, z1 + t1 * dz1);

      return {
        intersects: true,
        point: point,
        t1: t1,
        t2: t2,
      };
    } else {
      return {
        intersects: false,
        point: null,
        t1: t1,
        t2: t2,
        reason: '射线方向不相交',
      };
    }
  }
}
