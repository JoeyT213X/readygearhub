/**
 * Product + Offer JSON-LD for ReadyGearHub's own Payhip digital downloads only.
 *
 * shippingDetails describes a digital delivery (no physical shipment, $0, same day).
 * hasMerchantReturnPolicy is omitted on purpose: the site and Payhip product pages
 * do not publish a refund/return policy, and we will not invent one for markup.
 * review / aggregateRating are omitted: these shop pages are not reviews and
 * carry no ratings.
 */
import { hasPayhipId, payhipUrl, type PayhipProduct } from '../data/payhip';

const zeroDays = {
  '@type': 'QuantitativeValue',
  minValue: 0,
  maxValue: 0,
  unitCode: 'DAY',
};

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
    },
  };
}
