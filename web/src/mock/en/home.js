import { img, mockVideo } from '../helpers.js'

// 首页全部区块内容（英文版）
export const homeData = {
  seo: {
    title: 'FARLANE DEMO - Import & Export / Domestic Trade / Trade Agency',
    description: 'FARLANE DEMO offers import & export, domestic trade, trade agency, warehousing & distribution services covering 18 countries and regions, providing one-stop trade solutions.',
    keywords: 'trading company,import & export,domestic trade,trade agency,warehousing,distribution,Shanghai trading company',
  },
  hero: [
    {
      id: 'sourcing',
      title: 'Global Sourcing, Authentic Goods',
      subtitle: 'Direct overseas sourcing and brand-authorized distribution, covering 18 countries and regions with traceable supply.',
      image: img('global-sourcing-port', 1920, 1080),
      video: mockVideo,
      videoAutoplay: true,
      link: '/business/import-export',
    },
    {
      id: 'trade',
      title: 'Import & Export, Compliant Clearance',
      subtitle: 'In-house customs declaration and documentation team. Pre-classification, compliant clearance, end-to-end import & export.',
      image: img('customs-trade-docs', 1920, 1080),
      video: null,
      videoAutoplay: false,
      link: '/business/import-export',
    },
    {
      id: 'service',
      title: 'One-Stop Trade Services',
      subtitle: 'Sourcing, trading, warehousing, and distribution - the full chain integrated, so you can focus on sales.',
      image: img('trade-warehouse-distribution', 1920, 1080),
      video: null,
      videoAutoplay: false,
      link: '/services/warehousing',
    },
  ],
  stats: [
    { value: 8, suffix: ' Years', label: 'Demo Operating History' },
    { value: 320, suffix: '+', label: 'Demo Client Partners' },
    { value: 18, suffix: '', label: 'Demo Regions Covered' },
    { value: 98.6, suffix: '%', label: 'Demo On-Time Delivery' },
  ],
  aboutTeaser: {
    image: img('trading-team-office', 1000, 750),
    video: mockVideo,
    videoAutoplay: false,
    text: 'FARLANE DEMO is a fictional company created for Portal One. It demonstrates import and export, domestic distribution, warehousing, delivery, and content operations. Every name, metric, case study, and contact detail is sample data and can be replaced in the admin workspace.',
  },
  advantages: [
    { icon: 'GlobeHemisphereEast', title: 'Global Sourcing Network', text: 'Overseas sourcing across 18 countries and regions. Brand-authorized and direct sourcing, fully traceable.' },
    { icon: 'Certificate', title: 'Compliance & Clearance', text: 'In-house customs team and documentation center. Pre-classification and compliant declaration for both efficiency and compliance.' },
    { icon: 'Warehouse', title: 'Integrated Warehousing & Distribution', text: 'Self-operated Shanghai warehouse and nationwide distribution network. Visible inventory, instant order dispatch.' },
    { icon: 'Headset', title: 'Dedicated Account Manager', text: 'One-on-one service. Urgent orders responded within 30 minutes. Available on holidays.' },
  ],
  process: [
    { icon: 'ChatsCircle', name: 'Requirement Briefing', text: 'Understand category, use case, budget, and timeline. Clarify sourcing or distribution needs.' },
    { icon: 'NotePencil', name: 'Tailored Proposal', text: 'Compare sources and quotes. Deliver an integrated sourcing, trade, and delivery plan.' },
    { icon: 'Truck', name: 'Fulfillment', text: 'Contract, customs clearance, transport, warehousing. Real-time milestone updates.' },
    { icon: 'Package', name: 'Delivery & Settlement', text: 'Receipt and inbound. Document archival. Transparent one-time settlement.' },
  ],
}
