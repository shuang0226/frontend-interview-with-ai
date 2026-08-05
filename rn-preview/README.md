# RN WebView 预览壳

这个 Expo 应用通过 `react-native-webview` 加载根项目的 Taro H5 页面，用于快速检查 iOS、Android 和真机上的展示效果。

## 启动

先在仓库根目录启动 H5：

```bash
npm run dev:h5
```

另开一个终端，在仓库根目录启动 RN：

```bash
npm run dev:rn-preview
```

也可以直接打开平台模拟器：

```bash
npm run dev:rn-preview:ios
npm run dev:rn-preview:android
npm run dev:rn-preview:web
```

Web 端会使用 `iframe` 加载同一个 H5 地址；iOS 和 Android 继续使用原生 WebView。

默认地址：

- iOS 模拟器：`http://localhost:10086`
- Android 模拟器：`http://10.0.2.2:10086`

## 真机

复制环境变量示例，并把 IP 替换成电脑当前的局域网 IP：

```bash
cp rn-preview/.env.example rn-preview/.env.local
```

例如：

```dotenv
EXPO_PUBLIC_H5_URL=http://192.168.1.23:10086
```

手机与电脑需要处于同一局域网。修改 `.env.local` 后，在 Expo Go 中完整重新加载应用。
