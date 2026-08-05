# CLAUDE.md

本文件是 Claude Code 在 Portal One 仓库中的入口说明。开始工作前必须完整阅读根目录的 [AGENTS.md](./AGENTS.md)；其中的项目结构、数据安全、产品不变量和验证要求同样适用于 Claude。

## 工作方式

1. 先检查相关源文件、文档、ADR 和当前工作区状态。
2. 在修改前说明假设、影响范围和验证标准。
3. 只实现当前请求，不顺带重构或格式化无关代码。
4. 修改后执行与风险相称的构建、隔离 seed 或端到端验证。
5. 最终报告结果、验证和仍存在的限制。

需求存在多种解释时，不要静默选择会改变产品行为、公开数据或部署方式的方案。简单任务保持简单；复杂任务使用带验证项的短计划。

## 项目速览

- `web/`：公开门户，Vite + React。
- `admin/`：管理端，Vite + React + Ant Design。
- `server/`：Express + SQLite 单进程服务。
- `web/src/mock/{zh,en}`：前台 mock 与数据库初始化内容的共同来源。
- `server/data/`：本地运行数据，禁止提交、复制或未经授权重置。
- `deploy/DEPLOY.md`：部署流程的唯一详细文档。

生产环境使用 Node.js 20+。项目采用 ESM JavaScript，保持现有 JS/JSX 风格，不要无故迁移 TypeScript。

## 首选命令

```bash
npm install
npm start
npm run build
just dev
```

涉及数据库初始化时，优先使用独立目录：

```bash
cd server
PORTAL_DATA_DIR=/tmp/portal-one-claude-data \
ADMIN_USER=admin \
ADMIN_PASSWORD='<仅用于本次验证的密码>' \
npm run seed
```

`just seed` 和默认 `server/data/` 可能包含正式内容。没有明确授权时，不得用它们进行破坏性验证。

## 必须维护的边界

- 主营业务、服务项目、案例是独立集合。
- 中英文内容结构保持一致。
- 虚构演示内容不得混入真实公司、客户、联系方式或凭据。
- 新媒体必须有可再分发许可证和来源说明。
- 管理员默认密码只用于本地演示。
- nginx 客户端 IP 头、管理端鉴权、COS 密钥掩码和留言 IP 限频不得被绕过。
- README 不展开服务器部署步骤，只链接 `deploy/DEPLOY.md`。

## 完成检查

- Web 改动：构建；视觉改动再检查桌面和移动视口。
- Admin 改动：构建；鉴权和表单改动验证真实交互。
- Server 改动：隔离数据目录下验证成功与失败响应。
- Seed 改动：确认业务数量、媒体路径、管理员、线索和会话状态。
- 依赖改动：同步 package-lock，并运行生产依赖审计。

测试过程中创建的数据和进程应在结束前清理；只有用户需要预览时才保留本地服务，并明确端口与所用数据目录。
