import * as THREE from 'three';
import { objectsGroup } from '../../scene/group';
import { transformControls } from '../../controls/transform';
import type { IPoint } from '../../../interface';

export class Polyline {
  private id: string;

  private isFocused: boolean = false;

  private line: THREE.Line;

  private sprites: THREE.Sprite[] = [];

  private readonly color = new THREE.Color(0x00ffff);

  private readonly hoverColor = new THREE.Color(0xffff00);

  private readonly focusColor = new THREE.Color(0xff00ff);

  private readonly spriteMaterial: THREE.SpriteMaterial;

  constructor({ id, points }: { id: string; points: THREE.Vector3[] }) {
    this.id = id;
    const position = new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]));
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
    const material = new THREE.LineBasicMaterial({ color: this.color });
    this.line = new THREE.Line(geometry, material);

    // 初始化spriteMaterial
    this.spriteMaterial = this.createSpriteMaterial();
  }

  public static create({ id, points }: { id: string; points: IPoint[] }) {
    const ps = points.map((i) => new THREE.Vector3(i[0], i[1], i[2]));

    return new Polyline({ id, points: ps });
  }

  public onHover() {
    if (this.isFocused) return;

    // 变色
    const material = this.line.material as THREE.LineBasicMaterial;
    material.color.set(this.hoverColor);
  }

  public offHover() {
    if (this.isFocused) return;

    // 变色
    const material = this.line.material as THREE.LineBasicMaterial;
    material.color.set(this.color);
  }

  public onFocus() {
    this.isFocused = true;
    // 变色
    const material = this.line.material as THREE.LineBasicMaterial;
    material.color.set(this.focusColor);
    // 添加sprites
    const position = this.line.geometry.attributes.position.array;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < position.length; i += 3) {
      points.push(
        new THREE.Vector3(Number(position[i]), Number(position[i + 1]), Number(position[i + 2])),
      );
    }
    this.sprites = points.map((i) => this.createSprite(i));
    objectsGroup.add(...this.sprites);
  }

  public offFocus() {
    this.isFocused = false;
    transformControls.detach();
    // 还原
    const material = this.line.material as THREE.LineBasicMaterial;
    material.color.set(this.color);
    // 去除sprites
    objectsGroup.remove(...this.sprites);
    this.sprites = [];
  }

  public onSpriteMove() {
    // TODO
  }

  public dispose() {
    objectsGroup.remove(this.line);
  }

  public getLine() {
    return this.line;
  }

  public getObject3D() {
    return this.getLine();
  }

  public getId() {
    return this.id;
  }

  public getSprites() {
    return this.sprites;
  }

  private createSprite(point: THREE.Vector3) {
    const sprite = new THREE.Sprite(this.spriteMaterial);
    sprite.scale.set(0.1, 0.1, 1);
    sprite.position.set(point.x, point.y, point.z);

    return sprite;
  }

  private createSpriteMaterial() {
    // 创建小方格纹理（无需外部图片，用 Canvas 动态生成）
    const canvas = document.createElement('canvas');
    canvas.width = 1; // 纹理尺寸（越大方格越清晰）
    canvas.height = 1;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('canvas 2d context is null');

    // 在 Canvas 上绘制小方格（黑色边框，白色填充）
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 将 Canvas 转为 three.js 纹理
    const gridTexture = new THREE.CanvasTexture(canvas);

    // 创建精灵材质（确保粒子永远朝向屏幕）
    const material = new THREE.SpriteMaterial({
      map: gridTexture, // 应用小方格纹理
      color: new THREE.Color(0xff0000), // 粒子颜色（蓝色，可调整）
      sizeAttenuation: true, // 粒子随距离变远自动变小（更真实）
    });

    return material;
  }
}
