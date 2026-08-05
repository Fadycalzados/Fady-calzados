const SHOP = 'gfg8hj-yd.myshopify.com';
const STOREFRONT_TOKEN = '6defb920c830f6d263705aa0bcb6a074';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items } = req.body;
    if (!items?.length) return res.status(400).json({ error: 'No items' });

    const lines = items.map(item => ({
      merchandiseId: `gid://shopify/ProductVariant/${item.variantNumericId}`,
      quantity: 1,
    }));

    const response = await fetch(`https://${SHOP}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: `
          mutation cartCreate($lines: [CartLineInput!]!, $buyerIdentity: CartBuyerIdentityInput) {
            cartCreate(input: { lines: $lines, buyerIdentity: $buyerIdentity }) {
              cart { checkoutUrl }
              userErrors { field message }
            }
          }
        `,
        variables: {
          lines,
          buyerIdentity: { countryCode: 'ES' },
        },
      }),
    });

    const data = await response.json();
    const url = data?.data?.cartCreate?.cart?.checkoutUrl;
    const errors = data?.data?.cartCreate?.userErrors;

    if (!url) {
      console.error('cartCreate error:', errors || data);
      return res.status(400).json({ error: errors?.[0]?.message || 'Checkout failed' });
    }

    return res.status(200).json({ url });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
