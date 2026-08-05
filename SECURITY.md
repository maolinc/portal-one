# Security Policy

## 报告漏洞

请通过 GitHub 的私密 Security Advisory 报告漏洞，不要在公开 Issue 中披露可利用细节、真实凭据或个人数据。维护者确认后会在修复发布时公开必要说明。

## 部署前检查

- `admin / admin123` 仅用于本地演示。首次部署必须通过 `ADMIN_USER` 和 `ADMIN_PASSWORD` 覆盖。
- 生产站点必须启用 HTTPS；仓库内 nginx 配置只提供最小 HTTP 起点。
- `server/data/` 可能包含密码哈希、会话、咨询线索、云存储配置和上传文件，不得提交到 Git。
- 腾讯云 COS 密钥保存在 SQLite 中。生产环境应限制数据库文件权限，并使用最小权限的专用密钥。
- 留言接口按客户端 IP 限制为每 10 分钟最多 5 次；nginx 必须保留仓库配置中的 `X-Forwarded-For` 请求头。
- 定期更新 Node.js 与依赖，并在升级后重新执行构建和关键访问流程验证。

## 已知依赖告警

`react-router-dom@7.18.1` 当前被 npm 标记为 [RSC Action CSRF 告警](https://github.com/advisories/GHSA-qwww-vcr4-c8h2)。Portal One 是纯浏览器 SPA，不使用 React Server Components、Action 或 SSR，因此不具备该告警描述的服务端执行入口。上游发布安全版本后仍应及时升级；CI 会对生产依赖中的 critical 告警直接失败。

当前项目没有承诺固定的安全支持周期；安全修复以最新发布版本为准。
