# AI Agent 工具完整台账

快照时间：2026-08-05。范围是本机 `~/.codex/config.toml` 的显式配置、`~/.codex/skills` 与 `~/.agents/skills` 中的已安装 Skill，以及 `front-ai` 的历史对话记录。

## 分类原则

- **历史已使用**：能从当前项目的对话历史或项目产物中确认。
- **已配置 / 已安装**：当前本机存在，但不代表本项目已经调用。
- **禁用**：存在于配置中，但当前未启用。
- Codex 在每个会话临时提供的通用工具、模型能力和远程连接器不在此处逐项复制；它们不是用户显式安装或配置的项目资产。

## MCP

| MCP 服务 | 当前状态 | 历史使用 | 配置记录 |
| --- | --- | --- | --- |
| `node_repl` | 已配置 | 通过 Browser Plugin 检查本地 H5 时使用。 | [codex.config.toml](./mcp/codex.config.toml) |
| `computer-use` | 已配置，`enabled = false` | 当前项目历史未发现直接使用记录。 | [codex.config.toml](./mcp/codex.config.toml) |
| `playwright` | 已配置 | 已安装并用于 H5 页面交互检查。 | [`.mcp.json`](../.mcp.json) 与 [codex.config.toml](./mcp/codex.config.toml) |
| `codegraph` | 已配置 | 已在本项目中实际使用，用于理解和定位代码。 | [codex.config.toml](./mcp/codex.config.toml) |

## Skill

| Skill | 当前状态 | 历史使用 | 原始文件 |
| --- | --- | --- | --- |
| `ai-ready` | 已安装 | 已用于生成 `AGENTS.md` 和 README。 | [SKILL.md](./skills/ai-ready/SKILL.md) |
| `find-skills` | 已安装 | 已用于查找前端架构相关 Skill。 | [SKILL.md](./skills/find-skills/SKILL.md) |
| `grill-me` | 已安装 | 初始页面实现需求中被显式指定。 | [SKILL.md](./skills/grill-me/SKILL.md) |
| `react-expert` | 已安装 | 初始页面实现需求中被显式指定。 | [SKILL.md](./skills/react-expert/SKILL.md) |
| `english-identity` | 已安装，配置禁用 | 当前项目历史未发现直接使用记录。 | [SKILL.md](./skills/english-identity/SKILL.md) |
| `teach` | 已安装，配置禁用 | 当前项目历史未发现直接使用记录。 | [SKILL.md](./skills/teach/SKILL.md) |
| `grill-with-docs` | 已安装，配置禁用 | 当前项目历史未发现直接使用记录。 | [SKILL.md](./skills/grill-with-docs/SKILL.md) |

Superpowers 的内置子 Skill 属于 Plugin，不与独立安装的 Skill 重复复制；其来源、版本和禁用状态见 [plugins.md](./plugins.md)。

## Plugin

完整 Plugin 清单、启用状态、项目关联与官方 GitHub 地址见 [plugins.md](./plugins.md)。

## 维护方式

每次新增、禁用或使用 AI 工具时：

1. 更新本页的状态与使用记录；
2. Plugin 更新 [plugins.md](./plugins.md)；
3. MCP 更新 [mcp/codex.config.toml](./mcp/codex.config.toml)，如有通用配置变化再更新根目录 `.mcp.json`；
4. 新安装的独立 Skill，逐字复制其 `SKILL.md` 到 `ai-agent/skills/<名称>/SKILL.md`。
