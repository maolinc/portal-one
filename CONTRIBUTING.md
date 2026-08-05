# Contributing to Portal One

感谢你参与 Portal One。提交变更前，请先确认问题能够在当前主分支复现，并让改动保持小而明确。

## 本地开发

需要 Node.js 20+ 与 npm。首次安装并以生产形态启动：

```bash
npm install
npm start
```

需要三端热更新时安装 `just`，然后执行：

```bash
just dev
```

默认演示管理员为 `admin / admin123`。需要重建演示数据时运行 `npm run seed`；该命令会清空本地业务内容、线索、会话和管理员数据。

## 提交要求

- 功能与修复应说明用户可见行为，并附上对应验证方式。
- 不要提交 `server/data/`、上传文件、真实联系方式、云密钥或客户数据。
- 新增演示图片、视频或字体时，必须能够随 MIT 项目再分发，并在相邻目录记录来源和许可证。
- 中英文结构需保持一致；英文内容缺失时可以回退中文，但新字段应同时更新管理端 schema。
- 提交前至少执行根目录 `npm run build` 以及一次使用隔离 `PORTAL_DATA_DIR` 的干净 seed。

## Pull Request

Pull Request 请包含变更目的、主要实现、验证结果和界面变更截图。避免同时混入无关格式化或重构。
