import raw from './site.json';
import { organization } from '../../packages/catalog/organization';

/** Site config with the legal name owned by the shared catalog. */
export const site = {
  ...raw,
  legalName: organization.legalName,
};

export default site;
