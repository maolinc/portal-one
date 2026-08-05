import { img, mockVideo } from '../helpers.js'

// 首页全部区块内容，上线后由后端 /home 提供
export const homeData = {
  seo: {
    title: '远岚供应链 - 进出口贸易 / 国内贸易 / 贸易代理一体化商贸服务',
    description: '远岚供应链提供进出口贸易、国内贸易、贸易代理以及仓储配送与渠道分销服务，覆盖全球 18 个国家与地区，为企业提供一站式商贸解决方案。',
    keywords: '商贸公司,进出口贸易,国内贸易,贸易代理,仓储配送,渠道分销,上海贸易公司',
  },
  hero: [
    {
      id: 'sourcing',
      title: '全球采购，正品直达',
      subtitle: '海外直采与品牌授权并行，覆盖 18 个国家与地区，货源稳定可溯。',
      image: img('global-sourcing-port', 1920, 1080),
      video: mockVideo,
      videoAutoplay: true,
      link: '/business/import-export',
    },
    {
      id: 'trade',
      title: '进出口贸易，合规通关',
      subtitle: '自营报关与单证团队，归类预审、合规通关，进出口链路一体化操作。',
      image: img('customs-trade-docs', 1920, 1080),
      video: null,
      videoAutoplay: false,
      link: '/business/import-export',
    },
    {
      id: 'service',
      title: '一站式商贸服务',
      subtitle: '采购、贸易、仓储、分销全链路打通，让客户专注市场与销售。',
      image: img('trade-warehouse-distribution', 1920, 1080),
      video: null,
      videoAutoplay: false,
      link: '/services/warehousing',
    },
  ],
  stats: [
    { value: 8, suffix: '年', label: '演示经营周期' },
    { value: 320, suffix: '+', label: '演示合作客户' },
    { value: 18, suffix: '个', label: '演示覆盖区域' },
    { value: 98.6, suffix: '%', label: '演示准时交付率' },
  ],
  aboutTeaser: {
    image: img('trading-team-office', 1000, 750),
    video: mockVideo,
    videoAutoplay: false,
    text: '远岚供应链是为 Portal One 准备的虚构演示企业，用于展示进出口贸易、国内分销、仓储配送与内容运营能力。所有名称、数据、案例和联系方式均为示例，可在管理端替换为真实企业内容。',
  },
  advantages: [
    { icon: 'GlobeHemisphereEast', title: '全球采购网络', text: '海外采购覆盖 18 个国家与地区，品牌授权与直采并行，货源可溯。' },
    { icon: 'Certificate', title: '合规通关能力', text: '自营报关团队与单证中心，归类预审、合规申报，通关效率与合规双保障。' },
    { icon: 'Warehouse', title: '仓配一体能力', text: '上海自营仓储与全国配送网络，库存可视、订单即发，缩短交付链路。' },
    { icon: 'Headset', title: '专属客户经理', text: '一对一全程跟进，紧急订单 30 分钟内响应，节假日不打烊。' },
  ],
  process: [
    { icon: 'ChatsCircle', name: '需求沟通', text: '了解品类、用途、预算与时效，明确采购或分销需求。' },
    { icon: 'NotePencil', name: '定制方案', text: '比价寻源，输出采购、贸易与配送一体化方案。' },
    { icon: 'Truck', name: '履约执行', text: '签约下单、报关清关、运输仓储，节点信息实时同步。' },
    { icon: 'Package', name: '交付结算', text: '签收入库，单据归档，费用透明一次结清。' },
  ],
}
