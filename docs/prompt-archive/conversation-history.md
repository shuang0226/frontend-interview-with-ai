# front-ai 对话历史索引

本索引按历史任务从早到晚整理，保留用户诉求和已知结果，方便追溯项目决策；它不是完整逐字聊天记录。

| # | 主题 | 用户诉求摘要 | 已知结果 / 关联产物 |
| --- | --- | --- | --- |
| 1 | 多端技术选型 | 希望做两个页面，并让 RN、微信、H5、支付宝、抖音的效果尽可能一致；已有 Angular、React 基础。 | 选定 TypeScript + React + Taro；建议使用 Taro 跨端组件，并为 RN 差异保留端文件能力。 |
| 2 | 前端架构 Skill 调研 | 寻找能帮助搭建符合最佳实践前端架构的 Skill。 | 推荐 `react-expert`；后续已在项目工作流中使用 React/TypeScript 规范。 |
| 3 | 图片还原与初始页面建设 | 依据参考图实现前端页面；地址标签字数不固定、可位于开头或第二行结尾、后置标签不超过主文案区一半、地址最多两行，并兼容多端。 | 建立 Taro 地址列表与地址编辑能力；相关设计与计划位于 `docs/superpowers/specs/2026-08-03-address-list-design.md` 和 `docs/superpowers/plans/2026-08-03-address-list-implementation.md`。 |
| 4 | 优惠中心交互优化 | 每月券包要有领取反馈和 1 秒“领券中”；动画更明显；底部“一键领券”可领取全部券并同步显示加载状态。 | 建立优惠中心、领取状态变换和飞行动画；对应设计与计划见 `docs/superpowers/specs/2026-08-04-coupon-center-design.md`、`docs/superpowers/plans/2026-08-04-coupon-center-implementation.md`。 |
| 5 | H5 手机画布适配 | H5 尤其优惠中心适配较差，希望网页中只显示一个居中的手机尺寸区域，以接近小程序比例。 | 完成 H5 手机画布方案；文档见 `docs/superpowers/specs/2026-08-04-h5-phone-canvas-design.md`、`docs/superpowers/plans/2026-08-04-h5-phone-canvas-implementation.md`。 |
| 6 | 多端兼容测试 | 询问如何确保 RN、微信、H5、支付宝、抖音尽可能一致，以及是否可直接执行测试。 | 制定并执行多端兼容性检查；RN 端最终采用 Expo WebView 加载根项目 H5 的预览方案。 |
| 7 | 抖音端滚动抖动缺陷 | 在抖音开发者工具中，优惠中心滚动后页面持续快速抖动且不会停止。 | 已定位并修复跨端滚动行为问题；后续改动应继续在目标小程序工具中验证。 |
| 8 | 支付宝开发者工具查看页面 | 询问如何在支付宝开发者工具中定位并查看页面。 | 已提供调试和页面查看方式；属于开发环境使用记录。 |
| 9 | RN 端展示方案 | 询问 RN 端应该如何展示。 | 使用独立的 `rn-preview/` Expo 应用，通过 WebView 加载 H5 页面进行 iOS、Android、Web 快速预览。 |
| 10 | 规格文档合并 | 整理 `docs/superpowers/specs`，合并同主题文件，只保留原始需求，不保留 Bug 修复内容。 | 已合并为地址列表、优惠中心、H5 手机画布三份主题规格。 |
| 11 | 领取按钮错误禁用态 | 反馈可领取按钮不应该呈灰色 disabled 状态；补充说明 `disabled={false}` 仍触发灰色字体样式。 | 修复为可用时不输出 `disabled` 属性，避免命中 `[disabled]` 样式；类型检查与测试通过。 |
| 12 | 安装与配置 Playwright MCP | 请求安装 Playwright MCP。 | 已注册 Playwright MCP，供后续 H5 交互检查使用。 |
| 13 | 安装 ai-ready，并生成项目指引 | 安装 `ai-ready` Skill；随后要求仅生成 `AGENTS.md` 和 README，并补充运行环境要求。 | 已安装 Skill；新增 `AGENTS.md`，并补充 README 的项目、运行环境和贡献说明。 |

## 未单列沉淀的短期交互

- “重试”：只是重新执行第 1 项技术选型问答。
- “打开 H5 画面”：属于第 3 项的运行与人工检查动作。
- “第一行地址不需要省略”：是第 3 项地址排版规则的 Bug 修复，不改变原始需求。
- “没有修复”：是第 11 项领取按钮问题的反馈，最终根因已记录在该项结果中。

## 使用说明

当需要恢复某项背景时，先阅读本页对应条目，再查看 `docs/superpowers/` 中的设计或实施文档。需要提出新需求时，优先从 [可复用 Prompt](./reusable-prompts.md) 复制模板并补齐方括号中的变量。
