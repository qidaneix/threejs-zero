import * as THREE from 'three';
import { objectsGroup } from '../../scene/group';
import { nanoid } from 'nanoid';
import { DataBase } from '../../../DataBase';
import { Polyline } from '../Polyline';
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
    const points: [number, number, number][] = [];
    for (let i = 0; i < array.length; i += 3) {
      points.push([
        Number(array[i]),
        Number(array[i + 1]),
        Number(array[i + 2]),
      ]);
    }
    DataBase.insert({
      id: nanoid(6),
      points,
      type: EObject.polyline,
    });
    const polyline = Polyline.create(points);
    objectsGroup.add(polyline.getObject3D());
  }

  public dispose() {
    drawersGroup.remove(this.line, this.points);
  }

  private createGeometry(point: THREE.Vector3) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(
        new Float32Array([point.x, point.y, point.z]),
        3,
      ),
    );
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

// // 创建小方格纹理（无需外部图片，用 Canvas 动态生成）
// const canvas = document.createElement('canvas');
// canvas.width = 32; // 纹理尺寸（越大方格越清晰）
// canvas.height = 32;
// const ctx = canvas.getContext('2d');

// if (!ctx) throw new Error('canvas 2d context is null');

// // 在 Canvas 上绘制小方格（黑色边框，白色填充）
// ctx.fillStyle = '#ffffff';
// ctx.fillRect(0, 0, canvas.width, canvas.height);
// ctx.strokeStyle = '#000000';
// ctx.lineWidth = 2;
// ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

// // 将 Canvas 转为 three.js 纹理
// const gridTexture = new THREE.CanvasTexture(canvas);

// // 6. 创建精灵材质（确保粒子永远朝向屏幕）
// const material = new THREE.SpriteMaterial({
//   map: gridTexture, // 应用小方格纹理
//   color: 0x2196f3, // 粒子颜色（蓝色，可调整）
//   sizeAttenuation: true, // 粒子随距离变远自动变小（更真实）
// });
