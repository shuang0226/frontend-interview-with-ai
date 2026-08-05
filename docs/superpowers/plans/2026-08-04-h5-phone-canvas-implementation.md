# H5 居中手机画布实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将所有 H5 页面和已有固定浮层限制在居中的 390px 手机画布内，同时保持窄屏和小程序端现有体验。

**Architecture:** 全局 H5 DOM 规则负责创建浅灰背景及 390px 应用根画布。两个已有的固定定位遮罩在同一宽屏媒体条件下将自身左右边界改为视口中央的 390px，内部弹层继续使用 `width: 100%`，因此无需改动任何 React 状态、领取动画或小程序样式。

**Tech Stack:** Taro 3.6、React 18、TypeScript、SCSS、Vitest。

## Global Constraints

- 手机画布宽度固定为 `390px`；宽度不大于 `390px` 的视口必须为全宽。
- 宽屏外围为 `#f6f7f9`，不添加设备边框或投影。
- 仅使用 H5 DOM 选择器和 CSS 媒体条件；不改动微信小程序组件结构、数据或交互代码。
- 优惠中心与地址编辑浮层必须使用相同的 `390px` 宽屏边界。

---

### Task 1: 建立全局 H5 手机画布

**Files:**
- Modify: `src/app.scss:1-6`

**Interfaces:**
- Consumes: Taro H5 入口 `#app`，现有页面根元素 `.address-page`。
- Produces: 宽屏时居中 390px 的 H5 根画布；窄屏时全宽根画布。

- [x] **Step 1: 在 H5 产物前检查当前根节点结构**

Run: `npm run build:h5`

Expected: 构建成功；`dist/index.html` 中保留 `#app` 入口，以便全局 H5 样式命中该节点。

- [x] **Step 2: 追加根画布样式**

在 `src/app.scss` 的 `page` 规则之后加入以下 CSS；`body`、`#app` 都是 H5 DOM 选择器，因此小程序端不会命中：

```scss
html,
body {
  min-height: 100%;
  margin: 0;
  background: #f6f7f9;
}

@media screen and (min-width: 391PX) {
  #app {
    width: 390PX;
    min-height: 100vh;
    margin: 0 auto;
    overflow-x: hidden;
    background: #f6f7f9;
  }
}
```

- [x] **Step 3: 构建并检查根画布 CSS**

Run: `npm run build:h5 && rg -n "width:390PX|margin:0 auto" dist -g '*.css'`

Expected: H5 构建成功，压缩或编译后的 CSS 含有 390PX 宽度和自动水平外边距；没有 TypeScript 或 Sass 错误。

- [x] **Step 4: 提交此任务的源文件**

```bash
git add src/app.scss
git commit -m "feat: center h5 in phone canvas"
```

### Task 2: 将固定浮层约束到同一画布

**Files:**
- Modify: `src/components/coupon-center/index.scss:1-11`
- Modify: `src/components/address-editor/index.scss:1-11`

**Interfaces:**
- Consumes: `.coupon-center__mask` 和 `.address-editor__mask` 现有 `position: fixed; inset: 0` 遮罩；Task 1 定义的 390px 宽屏阈值。
- Produces: 宽屏时固定浮层宽为 390px 且居中；窄屏时保留原来的 `inset: 0` 行为。

- [x] **Step 1: 给优惠中心遮罩添加宽屏定位覆盖**

在 `src/components/coupon-center/index.scss` 的遮罩规则后追加：

```scss
@media screen and (min-width: 391PX) {
  .coupon-center__mask {
    right: auto;
    left: 50%;
    width: 390PX;
    transform: translateX(-50%);
  }
}
```

这会让 `.coupon-center` 的现有 `width: 100%` 跟随遮罩宽度，且飞券动画仍可根据视口坐标在同一固定定位层内渲染。

- [x] **Step 2: 给地址编辑遮罩添加相同的宽屏定位覆盖**

在 `src/components/address-editor/index.scss` 的遮罩规则后追加：

```scss
@media screen and (min-width: 391PX) {
  .address-editor__mask {
    right: auto;
    left: 50%;
    width: 390PX;
    transform: translateX(-50%);
  }
}
```

- [x] **Step 3: 执行类型与多端构建检查**

Run: `npm run typecheck && npm test && npm run build:h5 && npm run build:weapp`

Expected: 四条命令全部以退出码 0 结束。由于改动仅是 H5 DOM 选择器和媒体条件，微信小程序构建不应产生样式解析错误。

- [x] **Step 4: 在 390px 与宽屏 H5 中手工验收**

Run: `npm run dev:h5`

Expected: 在浏览器开发者工具中检查两个视口。

```text
390px：地址页与优惠中心全宽；优惠中心可关闭、可滚动、可领取。
1440px：#app 宽 390px 且居中；优惠中心遮罩和底部面板仅覆盖该 390px 区域。
```

- [x] **Step 5: 提交此任务的源文件**

```bash
git add src/components/coupon-center/index.scss src/components/address-editor/index.scss
git commit -m "fix: constrain h5 overlays to phone canvas"
```

## 验证记录

- `npm run typecheck`：通过。
- `npm test`：2 个测试文件、13 个测试通过。
- `npm run build:h5` 与 `npm run build:weapp`：通过；H5 保留既有入口包体大小警告。
- 实际 H5 测量：1280px 视口中 #app、优惠中心遮罩及底部面板均为 left=445px、width=390px；390px 视口中 #app 与优惠中心遮罩均为 left=0、width=390px。

### Task 3: 交付复核

**Files:**
- Modify: `docs/superpowers/plans/2026-08-04-h5-phone-canvas-implementation.md`（将完成项勾选为已完成）

**Interfaces:**
- Consumes: Task 1 的根画布和 Task 2 的浮层边界。
- Produces: 一份记录了已执行验证的实施计划。

- [x] **Step 1: 检查工作区只包含本功能的源码变更**

Run: `git status --short`

Expected: 除 `.superpowers/` 临时产物外，仅本计划文档是未跟踪变更。

- [x] **Step 2: 复查最终差异**

Run: `git diff --check && git diff -- src/app.scss src/components/coupon-center/index.scss src/components/address-editor/index.scss`

Expected: 无空白错误；所有固定物理长度必须是 `390PX`/`391PX`，两个遮罩规则内容一致。

- [ ] **Step 3: 记录验证结果并提交计划完成状态**

在本计划中勾选已完成步骤，记录 Task 2 的命令结果，再执行：

```bash
git add docs/superpowers/plans/2026-08-04-h5-phone-canvas-implementation.md
git commit -m "docs: record h5 phone canvas verification"
```
