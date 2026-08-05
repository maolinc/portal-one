// pm2 进程配置：由 `just deploy` 在服务器首次启动时拉起
// cwd 指向 remote_dir/server，PORT 由 env 注入
module.exports = {
  apps: [
    {
      name: 'portal-one',
      script: 'src/index.js',
      cwd: __dirname + '/../server',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      out_file: '../logs/pm2-out.log',
      error_file: '../logs/pm2-error.log',
      merge_logs: true,
      time: true,
    },
  ],
}
