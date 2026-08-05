# 采用静态站点生成，不上 CMS 与 SSR

门户一期全部为只读展示内容，无登录、无交易、无频繁更新（新闻中心已推迟到二期）。决定采用静态站点生成方案（推荐 Astro + Tailwind，内容以 Markdown/数据文件管理），构建产物为纯静态 HTML，部署到国内云 OSS + CDN。

**Considered Options**: WordPress（非技术人员可自助更新，但带来安全补丁与运维负担，且一期无频繁更新需求）；Next.js/Nuxt SSR（功能过剩，无动态渲染需求，且增加托管成本）；手写 Bootstrap 静态页（参考站联索的做法，成本最低但内容改动即改代码，多页面一致性差）。

**Consequences**: 内容更新需走代码仓库（改 Markdown → 重新构建部署），运营人员不能直接发文；二期若上新闻中心，需评估接 Headless CMS 或保持 Git-based 工作流。SEO、性能、托管成本均为最优。
