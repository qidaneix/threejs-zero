import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    // 将公共路径设置为相对路径
    assetPrefix: './',
    // 其他输出配置...
  },
  html: {
    // 配置需要注入到HTML中的标签
    tags: [
      {
        tag: 'script', // 标签类型为script
        attrs: {
          src: '/lib/webgl-utils.js', // 对应public目录下的test.js（构建后路径为/dist/test.js）
        },
      },
      {
        tag: 'script', // 标签类型为script
        attrs: {
          src: '/lib/webgl-debug.js', // 对应public目录下的test.js（构建后路径为/dist/test.js）
        },
      },

      {
        tag: 'script', // 标签类型为script
        attrs: {
          src: '/lib/cuon-utils.js', // 对应public目录下的test.js（构建后路径为/dist/test.js）
        },
      },
      {
        tag: 'script', // 标签类型为script
        attrs: {
          src: '/lib/cuon-matrix.js', // 对应public目录下的test.js（构建后路径为/dist/test.js）
        },
      },
    ],
  },
});
