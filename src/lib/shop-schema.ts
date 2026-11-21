/**
 * Product + Offer JSON-LD for ReadyGearHub's own Payhip digital downloads only.
 *
 * shippingDetails describes a digital delivery (no physical shipment, $0, same day).
 * hasMerchantReturnPolicy matches the published /refund-policy/: digital sales are
 * final, except a full refund or replacement when a file is broken or does not work
 * as described. review / aggregateRating are omitted: these shop pages are not
 * reviews and carry no ratings.
 */
import { hasPayhipId, payhipUrl, type PayhipProduct } from '../data/payhip';

export const REFUND_POLICY_PATH = '/refund-policy/';
export const REFUND_POLICY_URL = 'https://readygearhub.com/refund-policy/';

const zeroDays = {
  '@type': 'QuantitativeValue',
  minValue: 0,
  maxValue: 0,
  unitCode: 'DAY',
};

/**
 * Google merchant-listing offers require applicableCountry + returnPolicyCategory,
 * and only three categories are accepted: FiniteReturnWindow, NotPermitted, and
 * UnlimitedWindow. MerchantReturnUnspecified is not in that list.
 *
 * NotPermitted would be wrong (defective files are refunded). FiniteReturnWindow
 * would invent a day count the policy does not state. UnlimitedWindow plus
 * itemCondition DamagedCondition is the closest honest fit: no stated deadline
 * for a broken or unusable file, and change-of-mind returns of working downloads
 * are not offered. refundType covers a full refund or a replacement if preferred.
 */
export function merchantReturnPolicy() {
  return {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'US',
    returnPolicyCategory: 'https://schema.org/MerchantReturnUnlimitedWindow',
    itemCondition: 'https://schema.org/DamagedCondition',
    refundType: [
      'https://schema.org/FullRefund',
      'https://schema.org/ExchangeRefund',
    ],
    returnFees: 'https://schema.org/FreeReturn',
    merchantReturnLink: REFUND_POLICY_URL,
  };
}

export function shopProductSchema(product: PayhipProduct, pageUrl: string, imageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: imageUrl,
    brand: { '@type': 'Brand', name: 'ReadyGearHub' },
    offers: {
      '@type': 'Offer',
      price: product.priceAmount,
      priceCurrency: 'USD',
      availability: hasPayhipId(product) ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      url: hasPayhipId(product) ? payhipUrl(product.productId) : pageUrl,
      seller: { '@type': 'Organization', name: 'ReadyGearHub', url: 'https://readygearhub.com' },
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: zeroDays,
          transitTime: zeroDays,
        },
      },
      hasMerchantReturnPolicy: merchantReturnPolicy(),
    },
  };
}
