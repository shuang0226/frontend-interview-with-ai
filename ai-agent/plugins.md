# AI Agent Plugin 清单

本页记录当前 Codex 配置中出现过的所有 Plugin，以及本项目历史中可追溯到的 Plugin 与 CodeGraph MCP。Plugin 本体不复制到仓库，只保留官方 GitHub 地址、版本来源和状态。

| Plugin | 来源与状态 | 在本项目中的关联 | 官方 GitHub 地址 |
| --- | --- | --- | --- |
| Superpowers | 历史缓存版本 `6.2.0`；当前各子 Skill 均禁用。 | 用于早期的需求梳理、设计说明与实施计划，产物为 `docs/superpowers/`。 | [obra/superpowers](https://github.com/obra/superpowers) |
| CodeGraph（MCP） | 已配置，命令为 `codegraph serve --mcp`。严格来说它是 MCP 工具而非 Plugin，按清单透明度要求在此一并记录。 | 已在本项目中实际使用，用于理解和定位代码。 | [colbymchenry/codegraph](https://github.com/colbymchenry/codegraph) |

## 说明

- CodeGraph 的完整 MCP 配置快照位于 [mcp/codex.config.toml](./mcp/codex.config.toml)。
