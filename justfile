set shell := ["bash", "-c"]
set windows-shell := ["bash.exe", "-c"]

# 部署目标由环境变量提供，避免将当前服务器信息写入开源仓库。
host := env_var_or_default("DEPLOY_HOST", "")
user := env_var_or_default("DEPLOY_USER", "ubuntu")
remote_dir := env_var_or_default("DEPLOY_REMOTE_DIR", "/data/app/portal-one")
nginx_site := "/etc/nginx/sites-available/portal-one"
ssh_target := user + "@" + host
ssh_opts := "-o StrictHostKeyChecking=accept-new"
node_major := "20"

# 管理端初始化默认值；可用同名环境变量覆盖后再执行任意 just recipe。
export ADMIN_USER := env_var_or_default("ADMIN_USER", "admin")
export ADMIN_PASSWORD := env_var_or_default("ADMIN_PASSWORD", "admin123")

# 列出所有 recipe
default:
    @just --list --unsorted

# 本地构建前端到 web/dist
build:
    #!/usr/bin/env bash
    set -euo pipefail
    cd web
    [ -d node_modules ] || npm install
    npm run build
    echo "-> 构建完成: web/dist"

# 构建管理端到 admin/dist
build-admin:
    #!/usr/bin/env bash
    set -euo pipefail
    cd admin
    [ -d node_modules ] || npm install
    npm run build
    echo "-> 构建完成: admin/dist"

# 构建全部前端（web + admin）
build-all: build build-admin

# 初始化/重置 SQLite 种子数据（导入 web/src/mock）
seed:
    #!/usr/bin/env bash
    set -euo pipefail
    [ -n "$ADMIN_PASSWORD" ] || { echo "缺少 ADMIN_PASSWORD；请在执行 just seed 前设置管理员密码。" >&2; exit 2; }
    cd server
    [ -d node_modules ] || npm install
    npm run seed

# 远程初始化/重置 SQLite 种子数据：推 web/src/mock + locales 到服务器后跑 npm run seed
# 首次部署后必跑一次，否则管理端无账号可登录、前台无业务数据
seed-remote:
    #!/usr/bin/env bash
    set -euo pipefail
    [ -n "$ADMIN_PASSWORD" ] || { echo "缺少 ADMIN_PASSWORD；请在执行 just seed-remote 前设置管理员密码。" >&2; exit 2; }
    echo "-> 推送 web/src/mock + web/src/locales 到服务器"
    tar -czf - web/src/mock web/src/locales | ssh {{ssh_opts}} {{ssh_target}} \
      "set -e; cd {{remote_dir}}; rm -rf web/src/mock web/src/locales; mkdir -p web/src; tar -xzf -"
    echo "-> 远程执行 npm run seed（幂等：先清空业务表再灌入）"
    printf '%s\n%s\n' "$ADMIN_USER" "$ADMIN_PASSWORD" | ssh {{ssh_opts}} {{ssh_target}} '
      set -eu
      IFS= read -r admin_user
      IFS= read -r admin_password
      [ -n "$admin_password" ] || { echo "缺少管理员密码" >&2; exit 2; }
      cd {{remote_dir}}/server
      ADMIN_USER="$admin_user" ADMIN_PASSWORD="$admin_password" npm run seed
    '
    echo "-> seed 完成。管理员账号: $ADMIN_USER"

# 启动后端（单进程：/api + /admin + web/dist，http://localhost:3000）
server:
    #!/usr/bin/env bash
    set -euo pipefail
    cd server
    [ -d node_modules ] || npm install
    npm run dev

# 管理端开发模式（Vite dev，代理 /api 到 localhost:3000）
admin-dev:
    #!/usr/bin/env bash
    set -euo pipefail
    cd admin
    [ -d node_modules ] || npm install
    npm run dev

# 部署: 构建前端 + 推送 web/dist + admin/dist + server 代码 + 远程 npm install + pm2 重载
deploy: build-all
    #!/usr/bin/env bash
    set -euo pipefail
    echo "-> 打包 web/dist + admin/dist + server 代码（排除 node_modules / data）"
    tar -czf - \
      --exclude='server/node_modules' \
      --exclude='server/data' \
      web/dist admin/dist \
      server/src server/package.json server/package-lock.json \
      deploy/ecosystem.config.js \
      | ssh {{ssh_opts}} {{ssh_target}} \
        "set -e; \
         cd {{remote_dir}}; \
         rm -rf web admin server/src server/package.json server/package-lock.json deploy; \
         tar -xzf -; \
         mkdir -p logs; \
         cd server; \
         npm install --omit=dev --no-audit --no-fund; \
         cd {{remote_dir}}; \
         if pm2 jlist 2>/dev/null | grep -q portal-one; then \
           pm2 reload deploy/ecosystem.config.js --update-env; \
         else \
           pm2 start deploy/ecosystem.config.js; \
           pm2 save; \
         fi; \
         echo '-> pm2 进程:'; pm2 describe portal-one | head -20"
    echo "-> 部署完成。验证: just verify  |  访问: http://{{host}}/"

# 登录服务器
ssh:
    ssh {{ssh_opts}} {{ssh_target}}

# 初始化服务器: 装 nginx + Node 20 + pm2 + 建目录 + 开机自启（首次部署执行一次）
provision:
    #!/usr/bin/env bash
    set -euo pipefail
    ssh {{ssh_opts}} {{ssh_target}} 'set -e; \
      sudo apt-get update; \
      sudo DEBIAN_FRONTEND=noninteractive apt-get install -y nginx curl ca-certificates build-essential python3; \
      if ! command -v node >/dev/null 2>&1; then \
        curl -fsSL https://deb.nodesource.com/setup_{{node_major}}.x | sudo -E bash -; \
        sudo DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs; \
      fi; \
      sudo npm install -g pm2; \
      sudo mkdir -p {{remote_dir}}/logs; \
      sudo chown -R {{user}}:{{user}} {{remote_dir}}; \
      sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u {{user}} --hp /home/{{user}}; \
      echo "-> 装好的版本:"; \
      node -v; npm -v; pm2 -v; nginx -v 2>&1'

# 把 deploy/nginx.portal-one.conf 安装为 nginx 站点配置并启用
nginx-install:
    #!/usr/bin/env bash
    set -euo pipefail
    scp {{ssh_opts}} deploy/nginx.portal-one.conf {{ssh_target}}:/tmp/portal-one.conf
    ssh {{ssh_opts}} {{ssh_target}} 'set -e; \
      sudo mv /tmp/portal-one.conf {{nginx_site}}; \
      sudo ln -sf {{nginx_site}} /etc/nginx/sites-enabled/portal-one; \
      sudo rm -f /etc/nginx/sites-enabled/default; \
      sudo nginx -t; \
      sudo systemctl reload nginx; \
      echo "-> nginx 站点配置已安装并 reload"'

# 在服务器上手动改完配置后执行 reload
nginx-reload:
    ssh {{ssh_opts}} {{ssh_target}} 'sudo nginx -t && sudo systemctl reload nginx'

# 查看服务器上当前安装的站点配置
nginx-show:
    ssh {{ssh_opts}} {{ssh_target}} 'sudo cat {{nginx_site}} 2>/dev/null || echo "未安装，请执行: just nginx-install"'

# 实时查看 nginx access 日志
logs:
    ssh {{ssh_opts}} {{ssh_target}} 'sudo tail -n 200 -f /var/log/nginx/portal-one.access.log'

# 实时查看 nginx error 日志
errors:
    ssh {{ssh_opts}} {{ssh_target}} 'sudo tail -n 200 -f /var/log/nginx/portal-one.error.log'

# 查看 pm2 进程状态
pm2-status:
    ssh {{ssh_opts}} {{ssh_target}} 'pm2 status'

# 实时查看 pm2 应用日志（最近 200 行 + follow）
pm2-logs:
    ssh {{ssh_opts}} {{ssh_target}} 'pm2 logs portal-one --lines 200'

# 重启 pm2 进程（force restart，非优雅 reload）
pm2-restart:
    ssh {{ssh_opts}} {{ssh_target}} 'pm2 restart portal-one && pm2 save'

# 停止 pm2 进程
pm2-stop:
    ssh {{ssh_opts}} {{ssh_target}} 'pm2 stop portal-one && pm2 save'

# 本地一键运行：构建 web+admin → kill 占用 3000 的进程 → 启动后端单进程
# 同一端口访问三端：http://localhost:3000/（门户） /admin/（管理端） /api（后端）
local: build-all
    #!/usr/bin/env bash
    set -euo pipefail
    PORT=3000
    echo "-> 检查端口 $PORT 占用"
    if command -v lsof >/dev/null 2>&1; then
      pids=$(lsof -ti:"$PORT" 2>/dev/null || true)
      [ -n "$pids" ] && { echo "  kill: $pids"; kill -9 $pids 2>/dev/null || true; }
    elif command -v netstat >/dev/null 2>&1; then
      for pid in $(netstat -ano 2>/dev/null | grep -E ":$PORT\s+.*LISTENING" | awk '{print $NF}' | sort -u); do
        echo "  kill: $pid"
        taskkill //F //PID "$pid" 2>/dev/null || true
      done
    fi
    cd server
    [ -d node_modules ] || npm install
    if [ ! -f data/portal.db ]; then
      [ -n "$ADMIN_PASSWORD" ] || { echo "首次运行请设置 ADMIN_PASSWORD。" >&2; exit 2; }
      npm run seed
    fi
    echo "-> 启动 http://localhost:$PORT  (门户 /  管理端 /admin  后端 /api)"
    npm run dev

# 本地开发：三端热更新（后端 3000 / 门户 5173 / 管理端 5174），先 kill 这三个端口的占用
# Ctrl+C 退出会清理所有子进程；若残留，下次启动前会按端口清理
dev:
    #!/usr/bin/env bash
    set -euo pipefail
    for PORT in 3000 5173 5174; do
      if command -v lsof >/dev/null 2>&1; then
        pids=$(lsof -ti:"$PORT" 2>/dev/null || true)
        [ -n "$pids" ] && { echo "-> kill :$PORT ($pids)"; kill -9 $pids 2>/dev/null || true; }
      elif command -v netstat >/dev/null 2>&1; then
        for pid in $(netstat -ano 2>/dev/null | grep -E ":$PORT\s+.*LISTENING" | awk '{print $NF}' | sort -u); do
          echo "-> kill :$PORT ($pid)"
          taskkill //F //PID "$pid" 2>/dev/null || true
        done
      fi
    done
    [ -d server/node_modules ] || (cd server && npm install)
    [ -d web/node_modules ] || (cd web && npm install)
    [ -d admin/node_modules ] || (cd admin && npm install)
    if [ ! -f server/data/portal.db ]; then
      [ -n "$ADMIN_PASSWORD" ] || { echo "首次运行请设置 ADMIN_PASSWORD。" >&2; exit 2; }
      (cd server && npm run seed)
    fi
    PIDS=()
    cleanup() {
      for pid in "${PIDS[@]}"; do
        kill "$pid" 2>/dev/null || true
      done
    }
    trap cleanup EXIT INT TERM
    (cd server && npm run dev) &
    PIDS+=($!)
    (cd web && npm run dev) &
    PIDS+=($!)
    (cd admin && npm run dev) &
    PIDS+=($!)
    echo
    echo "  后端   http://localhost:3000/api"
    echo "  门户   http://localhost:5173/"
    echo "  管理端 http://localhost:5174/admin/"
    echo
    wait

# 从服务器本地 curl 验证：nginx 走 80 + Node 直连 3000 + pm2 进程
verify:
    #!/usr/bin/env bash
    set -euo pipefail
    echo '-> nginx :80 ->'
    ssh {{ssh_opts}} {{ssh_target}} 'curl -sI http://localhost/ | head -5'
    echo '-> Node :3000 直连 ->'
    ssh {{ssh_opts}} {{ssh_target}} 'curl -sI http://localhost:3000/ | head -3'
    echo '-> pm2 进程 ->'
    ssh {{ssh_opts}} {{ssh_target}} 'pm2 describe portal-one 2>/dev/null | grep -E "status|uptime|restarts|exec mode" | head -5 || echo "portal-one 未运行"'
