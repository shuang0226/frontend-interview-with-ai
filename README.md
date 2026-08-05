# 跨端地址列表

基于 Taro 3 + React + TypeScript 的地址列表演示，复刻参考图的卡片式列表、选择状态与编辑入口，并支持跨端编辑地址、联系人、手机号和任意数量的标签。

## 运行环境与要求

| 项目 | 要求或建议 |
| --- | --- |
| Node.js | **推荐 20 LTS 或 22 LTS**；最低为 18.0.0。Node 18 请使用该主版本的最新维护版本。 |
| npm | 使用随推荐 Node.js LTS 附带的 npm（建议 npm 10 或更高版本）。仓库包含 `package-lock.json`，请使用 npm 安装依赖。 |
| 已验证环境 | 当前开发环境为 Node.js `v25.8.1`、npm `11.11.0`。 |
| 操作系统 | macOS、Windows 与 Linux 均可运行；小程序预览还需要对应平台的开发者工具。 |

开始前可通过以下命令检查版本：

```bash
node --version
npm --version
```

- **网络与磁盘**：首次运行需要网络连接以下载根项目和 `rn-preview/` 的依赖。
- **H5 预览**：需要现代浏览器。H5 开发服务器默认监听 `http://localhost:10086`，请确认该端口未被占用。
- **小程序构建**：需要相应平台的开发者工具或真机环境。构建后将 `dist/` 导入微信、支付宝或头条小程序开发者工具进行预览与调试。
- **RN 预览（可选）**：仅在需要检查原生容器展示时使用。需要 Expo Go，或已配置的 iOS Simulator / Android Emulator；RN 预览壳会加载正在运行的 H5 服务。
- **真机 RN 预览（可选）**：手机与电脑必须处于同一局域网，并在 `rn-preview/.env.local` 中设置电脑可访问的 `EXPO_PUBLIC_H5_URL`。

## 使用

```bash
npm install
npm run dev:h5
```

### RN 快速预览

仓库包含一个独立的 Expo WebView 预览壳。首次使用先安装它的依赖：

```bash
npm --prefix rn-preview install
```

保持 `npm run dev:h5` 运行，再开一个终端执行：

```bash
npm run dev:rn-preview
```

若要在浏览器中检查 Expo 预览壳，可执行：

```bash
npm run dev:rn-preview:web
```

iOS 模拟器和 Android 模拟器已配置默认 H5 地址；真机使用方法见 [`rn-preview/README.md`](./rn-preview/README.md)。

构建命令：

```bash
npm run build:h5
npm run build:weapp
npm run build:alipay
npm run build:tt
```

## 验证

```bash
npm run typecheck
npm test
```

## AI Agent 工具清单

本项目将本机已配置、缓存或在项目历史中使用过的 AI Agent 工具记录在版本库中，以便透明追溯；这些文件不是跨机器自动复用的配置。

| 类型 | 存放位置 | 内容 |
| --- | --- | --- |
| Plugin | [ai-agent/plugins.md](./ai-agent/plugins.md) | 当前配置与历史中所有可追溯 Plugin 的官方 GitHub 地址。 |
| MCP | [`.mcp.json`](./.mcp.json) / [ai-agent/mcp/codex.config.toml](./ai-agent/mcp/codex.config.toml) | 通用 Playwright 配置，以及包含 CodeGraph、Node REPL、Computer Use 的完整 Codex 快照。 |
| Skill | [ai-agent/skills/](./ai-agent/skills/) | 本机已安装的全部原始 `SKILL.md` 文件。 |
| 总览 | [ai-agent/inventory.md](./ai-agent/inventory.md) | 工具范围、状态、历史使用与未归档运行时能力的边界。 |

### MCP 使用方式

- `.mcp.json` 是本项目历史实际使用的 Playwright MCP 的通用配置表示。
- [ai-agent/mcp/codex.config.toml](./ai-agent/mcp/codex.config.toml) 是完整 Codex MCP 快照，包含 `node_repl`、`computer-use`、`playwright` 和 `codegraph`；其中 `computer-use` 当前为禁用状态。
- 该快照含有本机绝对路径和 Codex Desktop 内部运行时信息，旨在如实记录，不应被自动覆盖到其他机器的配置中。

### 已归档的原始 Skill

| Skill | 作用 | 原始文件 |
| --- | --- | --- |
| ai-ready | 分析仓库并生成 AI 协作配置。 | [SKILL.md](./ai-agent/skills/ai-ready/SKILL.md) |
| find-skills | 检索和安装适合特定任务的 Skill。 | [SKILL.md](./ai-agent/skills/find-skills/SKILL.md) |
| grill-me | 以追问方式打磨方案或设计。 | [SKILL.md](./ai-agent/skills/grill-me/SKILL.md) |
| react-expert | React/TypeScript 架构与实现指导。 | [SKILL.md](./ai-agent/skills/react-expert/SKILL.md) |

所有已归档的 `SKILL.md` 均逐字复制自本机已安装版本，未做改写。它们是源码归档，不会因放入项目而自动被 Codex 加载。各 Skill 的历史使用与当前启用状态请见 [ai-agent/inventory.md](./ai-agent/inventory.md)。

## 贡献

1. 基于当前分支创建功能分支，并保持改动范围聚焦。
2. 涉及地址或优惠券状态转换时，同时补充 `tests/` 中对应的 Vitest 用例。
3. 提交前运行以下验证：

   ```bash
   npm run typecheck
   npm test
   ```

4. 修改跨端界面、动画或构建配置时，请在 H5 中检查；影响 RN 预览时，再启动 `rn-preview/` 验证 WebView 展示。
5. 新增或调整交互规则时，同步更新 `docs/superpowers/` 中对应的设计说明或实施计划。
