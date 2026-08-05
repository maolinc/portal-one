// 站点全局配置（英文版）：公司信息、导航、底栏
export const siteConfig = {
  company: {
    logo: '',
    name: 'FARLANE SUPPLY CHAIN DEMO CO., LTD.',
    shortName: 'FARLANE DEMO',
    nameEn: 'FARLANE SUPPLY CHAIN DEMO',
    slogan: 'Open-source demo data · Fictional company',
    phone: '400-000-0000',
    phoneRaw: '+864000000000',
    fax: '000-00000000',
    email: 'hello@example.com',
    address: '100 Open Avenue, Example City (Demo Address)',
    hours: 'Mon–Fri, 9:00–18:00',
    qq: { id: '000000000', qr: '' },
    wechat: { id: 'portal-one-demo', qr: '' },
    icp: 'Demo ICP 00000000',
    policeIcp: 'Demo Public Security Filing 00000000000000',
    mapUrl: '',
  },
  nav: [
    { label: 'Home', path: '/' },
    {
      label: 'About Us',
      path: '/about',
      children: [
        { label: 'Company Profile', path: '/about/profile' },
        { label: 'Organization', path: '/about/organization' },
        { label: 'Our Journey', path: '/about/history' },
      ],
    },
    {
      label: 'Core Business',
      path: '/business',
      children: [
        { label: 'Import & Export Trade', path: '/business/import-export' },
        { label: 'Domestic Trade', path: '/business/domestic-trade' },
        { label: 'Trade Agency', path: '/business/trade-agency' },
      ],
    },
    {
      label: 'Value-Added Services',
      path: '/services',
      children: [
        { label: 'Warehousing & Distribution', path: '/services/warehousing' },
        { label: 'Channel Distribution', path: '/services/distribution' },
      ],
    },
    { label: 'Case Studies', path: '/cases' },
    { label: 'Contact Us', path: '/contact' },
  ],
  friendLinks: [
    { label: 'Demo Partner', href: '#' },
    { label: 'Demo Industry Association', href: '#' },
  ],
}
