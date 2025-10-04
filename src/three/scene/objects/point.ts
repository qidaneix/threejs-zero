import * as THREE from 'three';

/**
 * TODO 表现不是很好
 */
// 自定义着色器材质 - 实现公告板效果（始终面向相机）
const material = new THREE.ShaderMaterial({
  uniforms: {
    size: { value: 0.01 }, // 方格大小
  },

  vertexShader: /*glsl*/ `
                attribute vec3 color;
                varying vec3 vColor;
                uniform float size;

                void main() {
                    vColor = color;

                    // 计算点在世界空间中的位置
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

                    // 设置点的大小（可以根据距离相机的远近调整大小）
                    gl_PointSize = size * (150.0 / -mvPosition.z);

                    // 计算最终位置
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
  fragmentShader: /*glsl*/ `
                varying vec3 vColor;

                void main() {
                    // 计算点的中心到当前像素的距离
                    vec2 coords = gl_PointCoord - vec2(0.5);

                    // 绘制正方形（距离中心超过0.5的像素将被丢弃）
                    float dist = length(max(abs(coords) - 0.4, 0.0));
                    if (dist > 0.1) {
                        discard;
                    }

                    // 设置颜色和轻微的边框效果
                    float alpha = 1.0 - smoothstep(0.0, 0.1, dist);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
  transparent: true, // 启用透明度
  blending: THREE.AdditiveBlending, // 启用混合模式，使重叠部分更亮
});

const color = new THREE.Color(0, 0, 0);
const colorTypedArray = new Uint8Array([color.r, color.g, color.b]);

// geometry
const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
  'position',
  new THREE.BufferAttribute(new Float32Array(3), 3),
);
geometry.setAttribute('color', new THREE.BufferAttribute(colorTypedArray, 3));

// mesh
export function createPoint() {
  const point = new THREE.Points(geometry, material);

  return point;
}
