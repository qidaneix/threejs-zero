import * as THREE from 'three';

// 创建小方格纹理（无需外部图片，用 Canvas 动态生成）
const canvas = document.createElement('canvas');
canvas.width = 32; // 纹理尺寸（越大方格越清晰）
canvas.height = 32;
const ctx = canvas.getContext('2d');

if (!ctx) throw new Error('canvas 2d context is null');

// 在 Canvas 上绘制小方格（黑色边框，白色填充）
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = '#000000';
ctx.lineWidth = 2;
ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

// 将 Canvas 转为 three.js 纹理
const gridTexture = new THREE.CanvasTexture(canvas);

// 6. 创建精灵材质（确保粒子永远朝向屏幕）
const material = new THREE.SpriteMaterial({
  map: gridTexture, // 应用小方格纹理
  color: 0x2196f3, // 粒子颜色（蓝色，可调整）
  sizeAttenuation: true, // 粒子随距离变远自动变小（更真实）
});

export const sprite = new THREE.Sprite(material);
