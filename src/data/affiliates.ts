/**
 * Re-export of the shared catalog. Edit programs in
 * packages/catalog/affiliates.ts — this file stays so existing imports
 * keep working and ReadyGearHub output stays the same.
 */
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
} from '../../packages/catalog/affiliates';
export type { Network, Program, OutboundLink, LeadCta } from '../../packages/catalog/affiliates';
