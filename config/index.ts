import { defineConfig } from '@tarojs/cli';

export default defineConfig({
  projectName: 'address-list-cross-platform',
  date: '2026-08-03',
  designWidth: 375,
  deviceRatio: {
    375: 2,
    750: 1,
    640: 2.34
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  framework: 'react',
  compiler: {
    type: 'webpack5',
    // Taro 3 的旧预编译器与当前 Node 运行时不兼容，关闭后仍保持生产构建结果一致。
    prebundle: {
      enable: false
    }
  },
  plugins: [],
  mini: {},
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    devServer: {
      host: '0.0.0.0',
      port: 10086,
      allowedHosts: 'all'
    }
  }
});
