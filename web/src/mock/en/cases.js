import { img, mockVideo } from '../helpers.js'

// 案例展示（英文版），客户名称已脱敏
export const casesList = [
  {
    slug: 'electronics-import',
    title: 'Electronics Component Import Consolidation',
    industry: 'Electronics Manufacturing',
    cover: img('electronics-components-trade', 1000, 700),
    video: mockVideo,
    videoAutoplay: false,
    excerpt: 'Multi-supplier consolidation plus bonded distribution cut total import chain cost by nearly 30%.',
    seo: {
      title: 'Electronics Component Import Consolidation Case | FARLANE DEMO',
      description: 'Through overseas consolidation, bonded distribution, and customs pre-check, FARLANE DEMO helped an East China electronics manufacturer cut component import chain cost and compress lead time from 21 to 12 days.',
      keywords: 'electronic component import,trade agency,bonded distribution,consolidation',
    },
    background: 'The client is a mid-sized East China electronics manufacturer, sourcing ICs, connectors, and passive components from Japan, Korea, and Southeast Asia. Previously, a dozen suppliers shipped individually - single-pallet air or full-container sea - with customs handled by multiple brokers using inconsistent classification standards, making lead times hard to match with production schedules.',
    challenge: 'First, small-batch purchasing drove high per-shipment transport costs. Second, multiple brokers with inconsistent standards caused two classification-error redeclarations. Third, lead-time volatility forced the production line to carry high safety stock, tying up significant capital.',
    solution: 'FARLANE DEMO designed a consolidation-plus-distribution plan: consolidation warehouses in Osaka and Ho Chi Minh City, with multi-supplier goods consolidated weekly into sea shipments to Shanghai. Goods were stored in a bonded warehouse and released in batches per production work orders, with duty paid on release. All customs declarations were handled by our in-house team using a classification database to lock HS codes. We also provided rolling 2-week lead-time forecasts aligned with the client\'s production scheduling system.',
    results: [
      { value: 28, suffix: '%', label: 'Reduction in Total Trade Cost' },
      { value: 12, suffix: ' Days', label: 'Average Lead Time' },
      { value: 0, suffix: '', label: 'Annual Classification Errors' },
      { value: 35, suffix: '%', label: 'Safety Stock Capital Reduction' },
    ],
  },
  {
    slug: 'retail-supply',
    title: 'Retail & E-Commerce Supply Integration',
    industry: 'Retail & Supermarkets',
    cover: img('retail-store-shelf', 1000, 700),
    video: null,
    videoAutoplay: false,
    excerpt: 'Synchronized retail and e-commerce channel stocking cut new product time-to-shelf in half.',
    seo: {
      title: 'Retail & E-Commerce Supply Integration Case | FARLANE DEMO',
      description: 'FARLANE DEMO provided a domestic retailer with integrated retail supply and e-commerce distribution, cutting new product time-to-shelf from 10 to 5 weeks and improving channel inventory turnover by 40%.',
      keywords: 'retail supply,e-commerce distribution,channel integration,retail supply chain',
    },
    background: 'The client is a fast-growing imported cosmetics and daily goods brand agent in China, with 300+ SKUs sold across multiple retailers and e-commerce platforms. Rapid product iteration demands tight coordination between retail inbound and e-platform stocking.',
    challenge: 'The client had previously used fragmented service providers, causing information gaps: retail and e-platform inbound progress was disconnected from purchasing. Non-compliant labels led to platform rejections, and new product launches were repeatedly delayed. Channel inventory turnover was inefficient.',
    solution: 'We provided a full-chain solution: front-end assistance with filing documents and progress tracking; priority air freight for imports; transfer to self-operated warehouse after port clearance; in-warehouse Chinese label application and batch registration; and delivery to platforms and retailers per appointment rules, with pre-promo stock pre-positioning. A single project manager coordinated the entire process - the client had one point of contact.',
    results: [
      { value: 5, suffix: ' Weeks', label: 'New Product Time-to-Shelf' },
      { value: 300, suffix: '+', label: 'SKUs Unified' },
      { value: 99, suffix: '%', label: 'First-Pass Platform Inbound Rate' },
      { value: 40, suffix: '%', label: 'Channel Inventory Turnover Improvement' },
    ],
  },
  {
    slug: 'brand-agency',
    title: 'Overseas Food Brand: China Distribution',
    industry: 'Food & Beverages',
    cover: img('food-brand-agency', 1000, 700),
    video: null,
    videoAutoplay: false,
    excerpt: 'Filing, import, warehousing, and channel rollout integrated. 200+ retail stores covered in Year One.',
    seo: {
      title: 'Overseas Food Brand China Agency & Distribution Case | FARLANE DEMO',
      description: 'FARLANE DEMO provided an overseas food brand with China-market agency: import filing, customs clearance, warehousing & distribution, and channel rollout, covering 200+ retail stores and major e-platforms in Year One.',
      keywords: 'overseas brand agency,food import,China distribution,brand landing',
    },
    background: 'The client is a mid-sized European food brand with stable sales in its home and European markets, planning to enter China. Without a China team or import/export channels, the brand was unfamiliar with Chinese food import regulations, retail onboarding, and e-commerce operations.',
    challenge: 'First, food import involves consignee filing, health certificates, and Chinese label review - a complex process. Second, lacking domestic channel resources, the brand could not quickly reach end consumers. Third, without warehousing and delivery capabilities, the brand could not fulfill orders.',
    solution: 'As the brand\'s China regional agent, we provided one-stop landing: consignee filing and Chinese label review; import customs declaration and clearance; self-operated warehousing for inventory, with pick-and-ship by order; and retail and e-commerce channel rollout, including JD/Tmall flagship store operations and supply to 200+ retail stores nationwide. The brand focused on product and marketing; we handled everything else.',
    results: [
      { value: 200, suffix: '+', label: 'Retail Store Coverage' },
      { value: 4, suffix: '', label: 'Major E-Platforms Onboarded' },
      { value: 99, suffix: '%', label: 'On-Time Order Fulfillment Rate' },
      { value: 3, suffix: '×', label: 'Year-One Sales Volume' },
    ],
  },
]
