import * as THREE from 'three';
import { objectsGroup } from '../../scene/group';

export class Polyline {
  private id: string;

  private line: THREE.Line;

  private isFocused: boolean;

  private readonly color = new THREE.Color(0x84692f);

  private readonly hoverColor = new THREE.Color(0xffff00);

  private readonly focusColor = new THREE.Color(0xffffff);

  constructor({ id, points }: { id: string; points: THREE.Vector3[] }) {
    this.id = id;
    const position = new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]));
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
    const material = new THREE.LineBasicMaterial({
      color: this.color,
    });
    this.line = new THREE.Line(geometry, material);
  }

  public static create({
    id,
    points,
  }: {
    id: string;
    points: [number, number, number][];
  }) {
    const ps = points.map((i) => new THREE.Vector3(i[0], i[1], i[2]));

    return new Polyline({ id, points: ps });
  }

  public onHover() {
    const material = this.line.material;
    (material as THREE.LineBasicMaterial).color.set(this.hoverColor);
  }

  public offHover() {
    const material = this.line.material;
    (material as THREE.LineBasicMaterial).color.set(this.color);
  }

  public onFocus() {
    const material = this.line.material;
    (material as THREE.LineBasicMaterial).color.set(this.focusColor);
  }

  public offFocus() {
    const material = this.line.material;
    (material as THREE.LineBasicMaterial).color.set(this.color);
  }

  public dispose() {
    objectsGroup.remove(this.line);
  }

  public getObject3D() {
    return this.line;
  }

  public getId() {
    return this.id;
  }
}
