import { img, mockVideo } from '../helpers.js'

// 关于我们（英文版）：Company Profile / Organization / Our Journey
export const aboutData = {
  profile: {
    seo: {
      title: 'Company Profile - FARLANE SUPPLY CHAIN DEMO CO., LTD.',
      description: 'Founded in 2008, FARLANE SUPPLY CHAIN DEMO CO., LTD. specializes in import & export, domestic trade, and trade agency, with self-operated warehousing and channel distribution, providing one-stop trade solutions.',
      keywords: 'FARLANE DEMO,company profile,Shanghai trading company,import & export,trade agency',
    },
    paragraphs: [
      'FARLANE SUPPLY CHAIN DEMO CO., LTD. is a fictional company bundled with Portal One and does not represent a real organization. This page demonstrates how to structure a company profile, capabilities, milestones, and media. All names, qualifications, metrics, and case studies can be replaced in the admin workspace.',
      'The company is built on three core businesses: Import & Export Trade, with stable partnerships with overseas brands and factories across electronic components, cosmetics, food & beverages, and industrial materials; Domestic Trade, leveraging East and South China warehousing networks to provide stable supply to retailers and e-platforms; and Trade Agency, with compliance clearance at its core, providing agency sourcing, import, and export services for companies without import/export rights.',
      'To date, the company has served 320+ clients across electronics manufacturing, retail, cross-border e-commerce, and catering chains. We believe the value of trade lies not in buying and selling itself, but in making upstream and downstream match more efficiently. FARLANE DEMO is committed to being a long-trusted trade partner, delivering certainty and compliance.',
    ],
    images: [
      { src: img('company-lobby-front', 1200, 800), video: null, videoAutoplay: false },
      { src: img('warehouse-operation-floor', 1200, 800), video: null, videoAutoplay: false },
    ],
    certs: [
      'Import & Export Capability (Demo)',
      'Customs Process Capability (Demo)',
      'Quality Management System (Demo)',
      'Industry Association Membership (Demo)',
    ],
    video: {
      poster: img('corporate-video-poster', 1280, 720),
      url: mockVideo,
      autoplay: false,
    },
  },
  organization: {
    seo: {
      title: 'Organization - FARLANE SUPPLY CHAIN DEMO CO., LTD.',
      description: 'FARLANE DEMO organization: under the General Manager\'s Office, four business units - Import & Export, Domestic Trade, Trade Agency, Warehousing & Distribution - plus a Functional Support center.',
      keywords: 'FARLANE DEMO,organization,company structure',
    },
    root: "General Manager's Office",
    departments: [
      { name: 'Import & Export Trade Dept.', desc: 'Overseas sourcing, brand agency, import/export contract execution' },
      { name: 'Domestic Trade Dept.', desc: 'Domestic sourcing & distribution, retail and e-platform coordination' },
      { name: 'Trade Agency Dept.', desc: 'Agency import/export, customs declaration, documentation & compliance' },
      { name: 'Warehousing & Distribution Dept.', desc: 'Self-operated warehousing, nationwide delivery, inventory management' },
      { name: 'Functional Support', desc: 'Finance, HR, IT, and customer service' },
    ],
  },
  history: {
    seo: {
      title: 'Our Journey - FARLANE SUPPLY CHAIN DEMO CO., LTD.',
      description: 'FARLANE DEMO journey: founded in Shanghai in 2008, starting from import/export agency, gradually building an integrated service system across import & export, domestic trade, trade agency, and warehousing & distribution.',
      keywords: 'FARLANE DEMO,our journey,company history',
    },
    events: [
      { year: '2008', text: 'Founded in Shanghai, starting with electronic component import agency. Served 80+ clients in Year One.' },
      { year: '2011', text: 'Established domestic trade team. Expanded into East China retail and e-platform supply. Domestic business officially launched.' },
      { year: '2014', text: 'Obtained self-operated customs declaration qualifications. Trade agency shifted from outsourced to in-house. Clearance quality and efficiency fully controlled.' },
      { year: '2017', text: 'Signed China regional agency agreements with multiple overseas brands. Import & export business evolved from agency to brand-authorized sourcing.' },
      { year: '2020', text: 'Shanghai self-operated warehousing & distribution center launched. Warehousing-distribution integration completed. Full trade chain closed loop.' },
      { year: '2023', text: 'Order and inventory digital mid-platform launched. Clients can query orders, inventory, and logistics status online.' },
      { year: '2026', text: 'Client partnerships exceeded 320. Overseas sourcing network covers 18 countries and regions.' },
    ],
  },
}
