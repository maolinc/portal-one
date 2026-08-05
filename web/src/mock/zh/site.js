// 站点全局配置（公司信息、导航、底栏），上线后由后端 /site/config 提供
export const siteConfig = {
  company: {
    logo: '',
    name: '远岚供应链有限公司',
    shortName: '远岚供应链',
    nameEn: 'FARLANE SUPPLY CHAIN DEMO',
    slogan: '开源演示数据 · 非真实企业',
    phone: '400-000-0000',
    phoneRaw: '+864000000000',
    fax: '000-00000000',
    email: 'hello@example.com',
    address: '示例市开放大道 100 号（演示地址）',
    hours: '周一至周五 9:00 - 18:00',
    qq: { id: '000000000', qr: '' },
    wechat: { id: 'portal-one-demo', qr: '' },
    icp: '示例ICP备00000000号',
    policeIcp: '示例公网安备00000000000000号',
    mapUrl: '',
  },
  nav: [
    { label: '首页', path: '/' },
    {
      label: '关于我们',
      path: '/about',
      children: [
        { label: '公司简介', path: '/about/profile' },
        { label: '组织架构', path: '/about/organization' },
        { label: '成长历程', path: '/about/history' },
      ],
    },
    {
      label: '主营业务',
      path: '/business',
      children: [
        { label: '进出口贸易', path: '/business/import-export' },
        { label: '国内贸易', path: '/business/domestic-trade' },
        { label: '贸易代理', path: '/business/trade-agency' },
      ],
    },
    {
      label: '服务项目',
      path: '/services',
      children: [
        { label: '仓储配送', path: '/services/warehousing' },
        { label: '渠道分销', path: '/services/distribution' },
      ],
    },
    { label: '案例展示', path: '/cases' },
    { label: '联系我们', path: '/contact' },
  ],
  friendLinks: [
    { label: '示例合作伙伴', href: '#' },
    { label: '示例行业协会', href: '#' },
  ],
}
