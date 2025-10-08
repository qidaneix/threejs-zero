import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    // 将公共路径设置为相对路径
    assetPrefix: './',
    // 其他输出配置...
  },
});
