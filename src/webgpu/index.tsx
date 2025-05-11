// wgsl着色器
const vertWGSL = /*WGSL*/ `
// 顶点着色器主函数
@vertex
fn main(
    @builtin(vertex_index) vertexIndex: u32,
) -> @builtin(position) vec4<f32> {
    // 设置三角形的顶点坐标
    var pos = array<vec2<f32>, 3>(
        vec2(0.0, 0.5),
        vec2(-0.5, -0.5),
        vec2(0.5, -0.5),
    );
    // 返回顶点坐标
    return vec4<f32>(pos[vertexIndex], 0.0, 1.0);
}
`;

// 片元着色器
const fragWGSL = /*WGSL*/ `
@fragment
fn main() -> @location(0) vec4<f32> {
    return vec4(1.0, 0.0, 0.0, 1.0);
}
`;

export async function init(canvas: HTMLCanvasElement) {
  // 获取canvas上下文
  const context = canvas.getContext('webgpu');

  // 判断浏览器是否支持context
  if (!context) {
    throw new Error('context not supported.');
  }

  // 判断浏览器是否支持webgpu
  if (!navigator?.gpu) {
    throw new Error('gpu not supported.');
  }

  // 创建webgpu设备
  const adapter = await navigator?.gpu?.requestAdapter();

  // 获取webgpu设备，用于分配资源
  const device = await adapter.requestDevice();

  const format = await navigator.gpu.getPreferredCanvasFormat();

  console.log('adapter', adapter);
  console.log('device', device);
  console.log('context', context);
  console.log('format', format);

  // 配置上下文
  context.configure({
    device,
    // 获取画布的首选上下文格式
    format,
    // 设置不透明
    alphaMode: 'opaque',
  });

  // 创建渲染管线
  const pipeline = device.createRenderPipeline({
    // 布局，用于着色器资源绑定
    layout: 'auto',
    // 顶点着色器
    vertex: {
      module: device.createShaderModule({
        code: vertWGSL,
      }),
      // 入口函数
      entryPoint: 'main',
    },
    // 片元着色器
    fragment: {
      module: device.createShaderModule({
        code: fragWGSL,
      }),
      // 入口函数
      entryPoint: 'main',
      // 输出颜色
      targets: [
        {
          format,
        },
      ],
    },
    // 图元类型
    primitive: {
      topology: 'triangle-list',
    },
  });

  // 渲染函数
  function render() {
    // 开始命令编码
    // 开始渲染1个或几个通道->渲染状态->通过渲染管线绘制图元->结束渲染通道
    const commandEncoder = device.createCommandEncoder();
    // 开始渲染通道
    const renderPass = commandEncoder.beginRenderPass({
      // 颜色附件数组
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          clearValue: {
            r: 0.0,
            g: 0.0,
            b: 0.0,
            a: 1.0,
          },
          // 清除操作
          loadOp: 'clear',
          // 存储操作
          storeOp: 'store',
        },
      ],
    });
    // 设置渲染管线
    renderPass.setPipeline(pipeline);
    // 绘制三角形
    renderPass.draw(3, 1, 0, 0);
    // 结束渲染通道
    renderPass.end();
    // 提交命令
    device.queue.submit([commandEncoder.finish()]);
    // 结束命令编码

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  return canvas;
}
