# Portal One 部署文档

部署目标：把 `web/` + `admin/` 两个 Vite 静态站点和 `server/` Node 后端发布到远程 Ubuntu 服务器，由 nginx 反代到 pm2 守护的 Node 单进程，进程同时托管 `/api + /api/admin + /uploads + web/dist + admin/dist`。

所有运维命令都收口在项目根目录的 `justfile` 中，通过 just 调用。部署相关产物（本文档、nginx 配置、pm2 配置）均位于 `deploy/` 目录。

## 部署变量

| 项 | 值 |
| --- | --- |
| SSH | `$DEPLOY_USER@$DEPLOY_HOST` |
| 应用根目录 | `$DEPLOY_REMOTE_DIR`，默认 `/data/app/portal-one` |
| 持久化数据 | `$DEPLOY_REMOTE_DIR/server/data`（SQLite + uploads，部署不清空） |
| 日志 | `$DEPLOY_REMOTE_DIR/logs/pm2-{out,error}.log` |
| Web 服务 | nginx `:80` 反代到 `127.0.0.1:3000` |
| 应用进程 | pm2 守护 `portal-one`，开机自启 |
| nginx 站点配置 | `/etc/nginx/sites-available/portal-one` |
| 访问地址 | `http://$DEPLOY_HOST/` |

## 前置条件

### 本地环境
- Node 20+、npm
- `just` 命令运行器
  - Windows: `winget install Casey.Just` 或从 [release 页](https://github.com/casey/just/releases) 下 `just-x86_64-pc-windows-msvc.exe`，重命名为 `just.exe` 放到 PATH
- Git Bash（Windows 自带 `bash` / `ssh` / `scp` / `tar`）
- 已配好 SSH 免密登录到 `$DEPLOY_USER@$DEPLOY_HOST`

### 服务器
- Ubuntu 20.04+
- `$DEPLOY_USER` 用户可 `sudo`
- 80 端口未被占用

在执行任何远程命令前，先设置部署目标和管理员初始凭据：

```bash
export DEPLOY_HOST=your-server-ip-or-domain
export DEPLOY_USER=ubuntu
export DEPLOY_REMOTE_DIR=/data/app/portal-one
export ADMIN_USER=portal-admin
read -rsp '管理员密码: ' ADMIN_PASSWORD; echo
export ADMIN_PASSWORD
```

`justfile` 中的 `admin / admin123` 仅用于本地演示。面向公网部署时必须执行上面的自定义管理员设置，并在接收真实访问或留言前为站点启用 HTTPS；仓库内 nginx 配置只提供最小 HTTP 起点。

### 一次性配置 SSH 免密（如尚未配置）
```bash
ssh-keygen -t ed25519 -C "portal-one-deploy"
ssh-copy-id "$DEPLOY_USER@$DEPLOY_HOST"
ssh "$DEPLOY_USER@$DEPLOY_HOST"  # 应免密直接登录
```

## 首次部署（新服务器，依次执行）

```bash
just provision      # 1. 装 nginx + Node 20 + pm2 + 建目录 + pm2 开机自启
just nginx-install  # 2. 安装站点配置（全量反代 :80 -> :3000）+ reload
just deploy         # 3. 本地构建 web+admin + 推送 + 远程 npm install + pm2 启动
just seed-remote    # 4. 推 mock + locales 到服务器 + 远程跑 npm run seed（建 admin 账号 + 灌业务数据）
just verify         # 5. 验证 nginx 200 + Node 3000 + pm2 进程在线
```

完成后浏览器打开 `http://$DEPLOY_HOST/` 应看到首页，管理端地址为 `http://$DEPLOY_HOST/admin/`。使用环境变量 `ADMIN_USER` 与 `ADMIN_PASSWORD` 指定的凭据登录。

## 日常迭代部署

```bash
just deploy
```

该命令做的事：
1. 本地 `just build-all` -> `web/dist/` + `admin/dist/`
2. `tar -czf -` 打包 `web/dist + admin/dist + server/{src,package.json,package-lock.json} + deploy/ecosystem.config.js`（**排除** `server/node_modules` 与 `server/data`）
3. SSH 管道流式推送到 `$DEPLOY_REMOTE_DIR`，解压前仅清掉前端 dist 与 server 代码，**保留** `server/data`（SQLite + uploads）与 `server/node_modules`
4. 远程 `cd server && npm install --omit=dev --no-audit --no-fund` 增量装依赖
5. pm2 已有 `portal-one` 进程则 `pm2 reload --update-env` 优雅重载，否则 `pm2 start` + `pm2 save`

仅前端改动同样跑 `just deploy`（步骤 4 会快速跳过）。若改了 nginx 配置（`deploy/nginx.portal-one.conf`），再执行 `just nginx-install`。若改了 pm2 配置（`deploy/ecosystem.config.js`），需 `just pm2-restart`（reload 不会重读 ecosystem 文件）。

## 常用运维命令

| 命令 | 作用 |
| --- | --- |
| `just ssh` | 登录服务器 |
| `just logs` | 实时查看 nginx access 日志 |
| `just errors` | 实时查看 nginx error 日志 |
| `just pm2-status` | 查看 pm2 进程状态 |
| `just pm2-logs` | 实时查看 Node 应用日志（最近 200 行 + follow） |
| `just pm2-restart` | 强制重启 Node 进程（非优雅 reload） |
| `just pm2-stop` | 停止 Node 进程 |
| `just nginx-reload` | 改完服务器上的 nginx 配置后 reload |
| `just nginx-show` | 查看当前已安装的站点配置 |
| `just nginx-install` | 重新推送并启用本地 `deploy/nginx.portal-one.conf` |
| `just verify` | 在服务器上 curl 80 + 3000 + pm2 状态 |
| `just build` / `just build-admin` / `just build-all` | 仅本地构建，不推送 |
| `just seed` | 本地重置 SQLite 种子数据 |
| `just seed-remote` | 远程重置 SQLite 种子数据（推 mock + locales + 跑 npm run seed） |

## 架构说明

```
本地 web/dist + admin/dist + server/
        │ (tar | ssh)
        ▼
$DEPLOY_REMOTE_DIR ────┬── server/data/   (SQLite + uploads，持久化)
                       ├── server/node_modules/
                       ├── logs/pm2-*.log
                       └── pm2 守护 node src/index.js  ──▶ 127.0.0.1:3000
                                                              │
                                                              ▼
                                          nginx :80 ──proxy──▶ 互联网
```

- **单进程统管**：`server/src/index.js` 同时挂载 `/api`、`/api/admin`、`/uploads`、`/admin/*`（admin SPA）、`/*`（web SPA）。详见 [ADR-0003](../docs/adr/0003-single-process.md)。
- **nginx 全量反代**：`:80` 全部流量 proxy 到 `:3000`，nginx 只负责 gzip、安全头、`client_max_body_size`。静态资源由 Node `express.static` + `sendFile` 提供（Vite 产物带 hash，Node 已设 `maxAge: '7d'`）。
- **持久化**：`server/data/portal.db`（WAL 模式）+ `server/data/uploads/`。部署不触碰此目录。
- **进程守护**：pm2 `fork` 模式单实例，`autorestart` + `pm2 startup systemd` 开机自启 + `pm2 save` 持久化进程列表。
- **上传体积**：nginx `client_max_body_size 10m`，express.json `limit: '2mb'`。

## 故障排查

| 现象 | 排查方向 |
| --- | --- |
| `just deploy` 报权限错误 | `ssh "$DEPLOY_USER@$DEPLOY_HOST" "ls -ld $DEPLOY_REMOTE_DIR"`，所有者应为 `$DEPLOY_USER`；不是则使用 `sudo chown -R "$DEPLOY_USER:$DEPLOY_USER" "$DEPLOY_REMOTE_DIR"` 修复。 |
| 浏览器 502 | Node 进程没起：`just pm2-status` 看 portal-one 是否 online；`just pm2-logs` 看启动报错（多半是端口占用或 better-sqlite3 装失败） |
| 管理端登录提示账号密码错 | 服务器 SQLite 未初始化：`just seed-remote` 建账号 + 灌业务数据。首次部署漏跑 seed 的典型症状 |
| 浏览器 504 | Node 起了但响应慢，看 `just pm2-logs` 是否有长阻塞；nginx 默认 60s 超时 |
| 刷新子路由 404 | 不应出现，server 的 catch-all 已 fallback 到 `web/dist/index.html`；若出现说明请求没到 Node，检查 nginx 是否 `proxy_pass` 到 :3000 |
| 发布后页面没变 | `web/dist/index.html` 被 CDN 缓存；server 已对 `/index.html` 设 `no-cache`，强刷或等 CDN 失效 |
| `/api/*` 404 | 确认 pm2 进程在线 + `curl -I http://localhost:3000/api/health`（或任意已知路由）在服务器本地通 |
| better-sqlite3 安装失败 | 远程 `cd "$DEPLOY_REMOTE_DIR/server" && npm install --omit=dev` 看报错；通常是缺 `build-essential` / `python3`，`provision` 已装，若手动绕过则 `sudo apt-get install -y build-essential python3` |
| pm2 重启循环 | `just pm2-logs` 看启动报错；`pm2 describe portal-one` 看 `restarts` 计数；修完后 `just pm2-restart` |
| 上传图片 404 | 走 COS 时返回 COS URL，不走 COS 时返回 `/uploads/xxx`；后者需 `server/data/uploads/` 存在且进程有写权限 |

## 回滚

当前版本 `just deploy` 为覆盖式发布，不保留历史。回滚方式：

1. 本地 `git checkout <上一版本>` -> `just deploy`
2. 或登录服务器从备份恢复（如有）

`server/data/` 在部署中始终保留，回滚代码不会丢数据。如需原子发布 + 多版本回滚（releases 目录 + `current` 软链），可在 `justfile` 的 `deploy` recipe 中升级。
