# 前端智能体协作指南

## 项目概览

这是一个以 Taro 3、React 18 和 TypeScript 编写的跨端地址列表与优惠券中心演示。根项目的同一套组件可构建为 H5、微信小程序、支付宝小程序和抖音小程序；`rn-preview/` 是独立的 Expo 应用，通过 WebView 加载根项目的 H5 页面，供 iOS、Android 与 Web 快速预览。

## 目录结构

- `src/pages/index/`：唯一页面入口，管理地址编辑与优惠中心弹层的页面状态。
- `src/components/address-*`：地址条目、地址文本和地址编辑器；每个组件目录的 `index.scss` 与组件实现配套。
- `src/components/coupon-center/`：优惠券中心、优惠券卡片和飞行动画层。
- `src/data/`：地址与优惠券的初始演示数据。
- `src/types/`：地址、优惠券及动画坐标的领域类型。
- `src/utils/`：无 UI 副作用的地址编辑、地址排版与优惠券状态转换逻辑。
- `tests/`：Vitest 单元测试，覆盖地址和优惠券工具函数。
- `config/index.ts`：Taro 构建与 H5 开发服务器配置；H5 默认端口为 `10086`。
- `rn-preview/`：独立的 Expo/React Native WebView 预览壳及其依赖。
- `docs/superpowers/`：已完成功能的设计说明与实施计划，修改相关交互前应先阅读对应文档。

## 技术栈与约定

- 使用 Taro 组件（如 `View`、`Text`、`Button`、`ScrollView`），不要在跨端页面组件中直接依赖 DOM API。
- 使用 React 函数组件、Hooks 和严格 TypeScript；领域数据通过 `src/types/` 定义，再由 `src/data/` 提供演示数据。
- 样式采用 SCSS，并保持组件类名与组件目录内的 `index.scss` 一致。
- 页面状态保持在 `src/pages/index/index.tsx`，纯状态变换放在 `src/utils/`，以便直接通过 Vitest 测试。
- 优惠券飞行动画依赖 Taro 的选择器查询；必须保留测量失败时的回退坐标逻辑，避免非 H5 端或布局尚未完成时的动画异常。
- 地址文案最多显示两行；结尾标签最多占主文案区域的一半。修改地址展示时需同时检查 `AddressText`、其样式和 `address-layout` 工具。

## 常用命令

在仓库根目录执行：

```bash
npm install
npm run dev:h5
npm run build:h5
npm run build:weapp
npm run build:alipay
npm run build:tt
npm run typecheck
npm test
```

RN 预览壳首次使用还需要安装其独立依赖：

```bash
npm --prefix rn-preview install
npm run dev:rn-preview
```

H5 服务运行后，可使用 `npm run dev:rn-preview:ios`、`npm run dev:rn-preview:android` 或 `npm run dev:rn-preview:web` 选择预览端。真机地址通过 `rn-preview/.env.local` 中的 `EXPO_PUBLIC_H5_URL` 配置。

## 测试与验证

- 修改 `src/utils/address.ts` 时，更新并运行 `tests/address.test.ts`。
- 修改 `src/utils/coupon.ts` 时，更新并运行 `tests/coupon.test.ts`。
- 每次 TypeScript 或组件改动至少运行 `npm run typecheck`；涉及状态变换时再运行 `npm test`。
- 涉及布局、跨端组件或动画时，在 H5 中手动检查，并按影响范围使用 `rn-preview/` 验证 WebView 预览。

## 添加或修改功能

### 地址功能

1. 先在 `src/types/address.ts` 增补领域字段。
2. 在 `src/data/addresses.ts` 更新演示数据；数据转换逻辑放入 `src/utils/address.ts`。
3. 在 `AddressItem`、`AddressText` 或 `AddressEditor` 中接入展示与编辑能力，并同步更新对应 SCSS。
4. 在 `src/pages/index/index.tsx` 串联页面状态和回调。
5. 为工具函数的新增分支补充 `tests/address.test.ts`。

### 优惠券功能

1. 先更新 `src/types/coupon.ts` 和 `src/data/coupons.ts`。
2. 将可复用的领取、替换或插入规则放入 `src/utils/coupon.ts`，并补充 `tests/coupon.test.ts`。
3. 在 `CouponCard` 处理卡片类型与状态展示，在 `CouponCenterSheet` 处理领取流程、弹层状态和动画时序。
4. 修改动画时同步检查 `CouponFlightLayer`、`coupon-center/index.scss`、元素选择器以及回退坐标。

## 常见注意事项

- `rn-preview/` 有自己的 `package.json`、锁文件和 TypeScript 配置；不要把 Expo 依赖加入根项目。
- 根项目的 Taro 运行时与 RN 预览壳使用不同 React 主版本，二者不能共享组件依赖。
- `config/index.ts` 已关闭 Taro 预编译，以规避旧预编译器与当前 Node 运行时的不兼容问题；修改构建配置前先验证 H5 与目标小程序构建。
- 不要覆盖已有的设计文档或用户未提交的改动。涉及交互行为时，同步更新对应的 `docs/superpowers/specs/` 或 `docs/superpowers/plans/` 文档。

## 文档状态

项目已有按功能归档的设计说明与实施计划，位于 `docs/superpowers/`。README 提供运行、构建、验证和 RN 预览入口；新增跨端能力时应同时更新 README 和本文件中的相关命令或约定。
