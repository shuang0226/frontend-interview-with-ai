# 项目 AI Agent 资产

此目录是本项目的 AI Agent 工具清单。它以透明度为目的，记录本机上已配置、缓存或在项目历史中使用过的工具，而不是为了跨机器自动复用。

| 类型 | 存放位置 | 内容 |
| --- | --- | --- |
| Plugin | [plugins.md](./plugins.md) | 当前配置与历史中所有可追溯 Plugin 的官方 GitHub 地址。 |
| MCP | [`.mcp.json`](../.mcp.json) / [mcp/codex.config.toml](./mcp/codex.config.toml) | 通用 Playwright 配置，以及包含 CodeGraph、Node REPL、Computer Use 的完整 Codex 快照。 |
| Skill | [`skills/`](./skills/) | 本机已安装的全部原始 `SKILL.md` 文件。 |
| 总览 | [inventory.md](./inventory.md) | 工具范围、状态、历史使用与未归档运行时能力的边界。 |

## MCP 使用方式

- `.mcp.json` 是本项目历史实际使用的 Playwright MCP 的通用配置表示。
- [`mcp/codex.config.toml`](./mcp/codex.config.toml) 是完整 Codex MCP 快照，包含 `node_repl`、`computer-use`、`playwright` 和 `codegraph`；其中 `computer-use` 当前为禁用状态。
- 该快照含有本机绝对路径和 Codex Desktop 内部运行时信息，旨在如实记录，不应被自动覆盖到其他机器的配置中。

## 已归档的原始 Skill

| Skill | 作用 | 原始文件 |
| --- | --- | --- |
| ai-ready | 分析仓库并生成 AI 协作配置。 | [SKILL.md](./skills/ai-ready/SKILL.md) |
| find-skills | 检索和安装适合特定任务的 Skill。 | [SKILL.md](./skills/find-skills/SKILL.md) |
| grill-me | 以追问方式打磨方案或设计。 | [SKILL.md](./skills/grill-me/SKILL.md) |
| react-expert | React/TypeScript 架构与实现指导。 | [SKILL.md](./skills/react-expert/SKILL.md) |

所有已归档的 `SKILL.md` 均逐字复制自本机已安装版本，未做改写。它们是源码归档，不会因放入项目而自动被 Codex 加载。各 Skill 的历史使用与当前启用状态请见 [inventory.md](./inventory.md)。
