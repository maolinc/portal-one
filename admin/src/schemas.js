// 内容 schema：与 web/src/mock 的数据结构一一对应（ADR-0004 的 JSON 文档形态）
// 类型见 SchemaFields.jsx：text | textarea | number | image | seo | group | list | objects

const seoField = { name: 'seo', label: 'SEO（TDK）', type: 'seo' }
const text = (name, label) => ({ name, label, type: 'text' })
const textarea = (name, label, rows = 3) => ({ name, label, type: 'textarea', rows })

const nameTextObjects = (name, label, itemLabel) => ({
  name, label, type: 'objects', itemLabel,
  fields: [text('name', '名称'), textarea('text', '描述', 2)],
})

const businessSchema = [
  text('name', '名称'),
  text('nameEn', '英文大写名（如 IMPORT & EXPORT）'),
  text('tagline', '标语'),
  textarea('intro', '简介', 2),
  seoField,
  { name: 'overview', label: '概述（段落）', type: 'list', itemType: 'textarea' },
  nameTextObjects('scope', '服务范围', '范围'),
  nameTextObjects('process', '服务流程', '环节'),
  {
    name: 'advantages', label: '核心优势', type: 'objects', itemLabel: '优势',
    fields: [text('icon', '图标名（@phosphor-icons，如 GlobeHemisphereEast）'), text('title', '标题'), textarea('text', '描述', 2)],
  },
  {
    name: 'faqs', label: '常见问题', type: 'objects', itemLabel: '问答',
    fields: [text('q', '问题'), textarea('a', '回答', 3)],
  },
]

const caseSchema = [
  text('title', '标题'),
  text('industry', '行业'),
  textarea('excerpt', '摘要', 2),
  seoField,
  textarea('background', '客户背景', 4),
  textarea('challenge', '挑战', 4),
  textarea('solution', '解决方案', 4),
  {
    name: 'results', label: '成果数据', type: 'objects', itemLabel: '成果',
    fields: [{ name: 'value', label: '数值', type: 'number' }, text('suffix', '单位（如 % / 天 / 家）'), text('label', '说明')],
  },
]

const homeSchema = [
  seoField,
  {
    name: 'hero', label: 'Hero 轮播', type: 'objects', itemLabel: '轮播图',
    fields: [
      text('id', '标识（英文小写）'),
      text('title', '主标题'),
      textarea('subtitle', '副标题', 2),
      { name: 'image', label: '配图', type: 'image' },
      { name: 'video', label: '配图视频（可选，mp4 直链）', type: 'video' },
      { name: 'videoAutoplay', label: '视频自动播放（静音循环）', type: 'boolean' },
      text('link', '跳转链接（如 /business/import-export）'),
    ],
  },
  {
    name: 'stats', label: '数据统计带', type: 'objects', itemLabel: '数据',
    fields: [{ name: 'value', label: '数值', type: 'number' }, text('suffix', '单位'), text('label', '说明')],
  },
  {
    name: 'aboutTeaser', label: '公司简介预告', type: 'group',
    fields: [
      { name: 'image', label: '配图', type: 'image' },
      { name: 'video', label: '配图视频（可选，mp4 直链）', type: 'video' },
      { name: 'videoAutoplay', label: '视频自动播放（静音循环）', type: 'boolean' },
      textarea('text', '文案', 4),
    ],
  },
  {
    name: 'advantages', label: '核心优势', type: 'objects', itemLabel: '优势',
    fields: [text('icon', '图标名'), text('title', '标题'), textarea('text', '描述', 2)],
  },
  {
    name: 'process', label: '服务流程', type: 'objects', itemLabel: '环节',
    fields: [text('icon', '图标名'), text('name', '名称'), textarea('text', '描述', 2)],
  },
]

const aboutProfileSchema = [
  seoField,
  { name: 'paragraphs', label: '正文段落', type: 'list', itemType: 'textarea' },
  {
    name: 'images', label: '配图', type: 'objects', itemLabel: '配图',
    fields: [
      { name: 'src', label: '图片', type: 'image' },
      { name: 'video', label: '视频（可选，mp4 直链）', type: 'video' },
      { name: 'videoAutoplay', label: '视频自动播放（静音循环）', type: 'boolean' },
    ],
  },
  { name: 'certs', label: '资质荣誉', type: 'list', itemType: 'text' },
  {
    name: 'video', label: '宣传片', type: 'group',
    fields: [
      { name: 'poster', label: '封面图', type: 'image' },
      { name: 'url', label: '视频地址（mp4 直链或上传，空则只显示封面图）', type: 'video' },
      { name: 'autoplay', label: '自动播放（静音循环）', type: 'boolean' },
    ],
  },
]

const aboutOrganizationSchema = [
  seoField,
  text('root', '顶层名称（如 总经理室）'),
  {
    name: 'departments', label: '部门', type: 'objects', itemLabel: '部门',
    fields: [text('name', '名称'), textarea('desc', '职责', 2)],
  },
]

const aboutHistorySchema = [
  seoField,
  {
    name: 'events', label: '大事记', type: 'objects', itemLabel: '事件',
    fields: [text('year', '年份'), textarea('text', '事件', 2)],
  },
]

const siteSchema = [
  {
    name: 'company', label: '公司信息', type: 'group',
    fields: [
      text('name', '公司全称'), text('shortName', '简称'), text('nameEn', '英文名'),
      text('slogan', 'Slogan'), text('phone', '电话（展示）'), text('phoneRaw', '电话（tel: 链接用，如 +86...）'),
      text('fax', '传真'), text('email', '邮箱'), text('address', '地址'), text('hours', '营业时间'),
      text('icp', 'ICP 备案号'), text('policeIcp', '公安备案号'),
      text('mapUrl', '地图链接（百度/高德分享链接，用于联系我们页；可嵌入的子域才内嵌，其余退化为点击跳转）'),
      {
        name: 'wechat', label: '微信', type: 'group',
        fields: [text('id', '微信号'), { name: 'qr', label: '二维码图片（留空前台不显示）', type: 'image' }],
      },
      {
        name: 'qq', label: 'QQ', type: 'group',
        fields: [text('id', 'QQ 号'), { name: 'qr', label: '二维码图片（留空前台不显示）', type: 'image' }],
      },
    ],
  },
  {
    name: 'friendLinks', label: '友情链接', type: 'objects', itemLabel: '友链',
    fields: [text('label', '名称'), text('href', '链接')],
  },
]

const seoPagesSchema = [
  { name: 'business', label: '业务列表页（/business）', type: 'seo' },
  { name: 'services', label: '服务列表页（/services）', type: 'seo' },
  { name: 'cases', label: '案例列表页（/cases）', type: 'seo' },
  { name: 'contact', label: '联系页（/contact）', type: 'seo' },
]

export const COLLECTIONS = {
  business: { label: '主营业务', schema: businessSchema, mediaLabel: '配图' },
  services: { label: '服务项目', schema: businessSchema, mediaLabel: '配图' },
  cases: { label: '案例展示', schema: caseSchema, mediaLabel: '封面图' },
}

export const SINGLETONS = {
  home: { label: '首页内容', schema: homeSchema },
  'about.profile': { label: '关于我们 · 公司简介', schema: aboutProfileSchema },
  'about.organization': { label: '关于我们 · 组织架构', schema: aboutOrganizationSchema },
  'about.history': { label: '关于我们 · 成长历程', schema: aboutHistorySchema },
  site: { label: '站点信息', schema: siteSchema },
  'seo.pages': { label: '页面 SEO', schema: seoPagesSchema },
}
