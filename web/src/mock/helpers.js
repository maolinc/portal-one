const MEDIA_ROOT = '/demo/media'

const IMAGE_BY_SEED = {
  'global-sourcing-port': 'ocean-freight.svg',
  'port-container-trade': 'ocean-freight.svg',
  'customs-trade-docs': 'trade-compliance.svg',
  'trade-agency-docs': 'trade-compliance.svg',
  'trade-warehouse-distribution': 'smart-warehouse.svg',
  'domestic-warehouse-trade': 'smart-warehouse.svg',
  'warehouse-aisle-shelves': 'smart-warehouse.svg',
  'warehouse-operation-floor': 'smart-warehouse.svg',
  'trading-team-office': 'operations-team.svg',
  'company-lobby-front': 'operations-team.svg',
  'electronics-components-trade': 'electronics-case.svg',
  'retail-store-shelf': 'retail-case.svg',
  'retail-shelf-distribution': 'retail-case.svg',
  'food-brand-agency': 'food-case.svg',
  'corporate-video-poster': 'video-poster.svg',
}

export const img = (seed) => `${MEDIA_ROOT}/${IMAGE_BY_SEED[seed] ?? 'ocean-freight.svg'}`
export const mockVideo = `${MEDIA_ROOT}/supply-chain-overview.webm`
