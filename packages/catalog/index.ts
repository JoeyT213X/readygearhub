export {
  CJ_PID,
  AMAZON_TAG,
  AMAZON_DISCLOSURE,
  isAmazonUrl,
  amazonLink,
  amazonProductUrl,
  amazonSearchUrl,
  programs,
  isProgramLive,
  cjLink,
  buildLink,
  NO_PPC_PROGRAM_IDS,
  isPpcAllowed,
  isNoPpcProgram,
  noPpcProgramIds,
  resolveOutbound,
  resolveItemOutbound,
  programIdForItem,
  trackedItemLink,
  leadCtasFor,
} from './affiliates';
export type { Network, Program, OutboundLink, LeadCta } from './affiliates';

export { organization } from './organization';
export type { Organization } from './organization';

export { RGH_ORIGIN, categoryTargets, withUtm, workbenchToolsPath, workbenchFallbacks } from './targets';
export type { TargetLink, CategoryTarget } from './targets';

export { offers } from './offers';
export { productSummaries } from './products';
export type { ProductSummary } from './products';
