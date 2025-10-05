import * as THREE from 'three';
import { scene } from '../../scene';

export class Polyline {
  private line: THREE.Line;

  private readonly color = new THREE.Color(0x84692f);

  private readonly hoverColor = new THREE.Color(0xffff00);

  private readonly focusColor = new THREE.Color(0xffffff);

  constructor(points: THREE.Vector3[]) {
    const position = new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]));
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
    const material = new THREE.LineBasicMaterial({
      color: this.color,
    });
    this.line = new THREE.Line(geometry, material);

    scene.add(this.line);
  }

  public static create(points: [number, number, number][]) {
    const ps = points.map((i) => new THREE.Vector3(i[0], i[1], i[2]));

    const polyline = new Polyline(ps);
  }

  public onHover() {
    const material = this.line.material;
    (material as THREE.LineBasicMaterial).color = this.hoverColor;
  }

  public onFocus() {
    const material = this.line.material;
    (material as THREE.LineBasicMaterial).color = this.focusColor;
  }

  public dispose() {
    scene.remove(this.line);
  }
}
