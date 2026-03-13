import * as THREE from 'three';
import { objectsGroup } from '../../scene/group';
import { transformControls } from '../../controls/transform';
import type { I4Points, I4Vector4s } from '../../../interface';
import { computeTransformationMatrix } from '../../../utils/computeTransformationMatrix';

export class Cuboid {
  private id: string;

  private isFocused: boolean = false;

  private group: THREE.Group;

  private box: THREE.Mesh;

  private lineSegments: THREE.LineSegments;

  private readonly color = new THREE.Color(0x00ffff);

  private readonly hoverColor = new THREE.Color(0xffff00);

  private readonly focusColor = new THREE.Color(0xff00ff);

  constructor({ id, points }: { id: string; points: I4Vector4s }) {
    this.id = id;
    const matrix = computeTransformationMatrix(points); // 转换矩阵

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    this.box = new THREE.Mesh(geometry, material);
    this.box.raycast = () => {};

    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: this.color,
      opacity: 1,
      transparent: true,
    });
    this.lineSegments = new THREE.LineSegments(edgeGeometry, edgeMaterial);

    this.group = new THREE.Group();
    this.group.add(this.box);
    this.group.add(this.lineSegments);
    this.group.applyMatrix4(matrix);
  }

  public static create({ id, points }: { id: string; points: I4Points }) {
    const ps = points.map((i) => new THREE.Vector3(i[0], i[1], i[2])) as I4Vector4s;

    return new Cuboid({ id, points: ps });
  }

  public onHover() {
    if (this.isFocused) return;

    // 变色
    const material = this.box.material as THREE.LineBasicMaterial;
    material.color.set(this.hoverColor);
    (this.lineSegments.material as THREE.LineBasicMaterial).color.set(this.hoverColor);
  }

  public offHover() {
    if (this.isFocused) return;

    // 变色
    const material = this.box.material as THREE.LineBasicMaterial;
    material.color.set(this.color);
    (this.lineSegments.material as THREE.LineBasicMaterial).color.set(this.color);
  }

  public onFocus() {
    this.isFocused = true;
    // 变色
    const material = this.box.material as THREE.LineBasicMaterial;
    material.color.set(this.focusColor);
    (this.lineSegments.material as THREE.LineBasicMaterial).color.set(this.focusColor);
  }

  public offFocus() {
    this.isFocused = false;
    transformControls.detach();
    // 还原
    const material = this.box.material as THREE.LineBasicMaterial;
    material.color.set(this.color);
    (this.lineSegments.material as THREE.LineBasicMaterial).color.set(this.color);
  }

  public dispose() {
    objectsGroup.remove(this.group);
  }

  public getMash() {
    return this.group;
  }

  public getLineSegments() {
    return this.lineSegments;
  }

  public getObject3D() {
    return this.group;
  }

  public getId() {
    return this.id;
  }
}
