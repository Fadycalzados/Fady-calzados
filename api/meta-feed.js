const SHOPIFY_SHOP = process.env.SHOPIFY_SHOP;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

async function fetchShopifyProducts(cursor = null) {
  const query = `
    {
      products(first: 250, after: ${cursor ? `"${cursor}"` : 'null'}) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  compareAtPrice
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            totalInventory
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const response = await fetch(`https://${SHOPIFY_SHOP}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  if (data.errors) throw new Error(JSON.stringify(data.errors));

  let products = data.data.products.edges.map(e => e.node);

  if (data.data.products.pageInfo.hasNextPage) {
    const nextProducts = await fetchShopifyProducts(data.data.products.pageInfo.endCursor);
    products = [...products, ...nextProducts];
  }

  return products;
}

function formatForMeta(products) {
  return {
    data: products.map(p => {
      const currentAmount = parseFloat(p.priceRange.minVariantPrice.amount);
      const compareAtPrice = p.variants?.edges?.[0]?.node?.compareAtPrice;
      const compareAmount = compareAtPrice ? parseFloat(compareAtPrice) : null;
      const currency = p.priceRange.minVariantPrice.currencyCode;

      const item = {
        id: p.handle,
        title: p.title,
        description: p.description?.replace(/<[^>]*>/g, '') || p.title,
        availability: p.totalInventory > 0 ? 'in stock' : 'out of stock',
        condition: 'new',
        link: `https://www.fadycalzados.com/producto/${p.handle}`,
        image_link: p.images.edges[0]?.node.url || '',
        brand: 'Fady Calzados',
        google_product_category: '187',
        retailer_id: p.handle,
      };

      if (compareAmount && compareAmount > currentAmount) {
        item.price = `${compareAmount.toFixed(2)} ${currency}`;
        item.sale_price = `${currentAmount.toFixed(2)} ${currency}`;
      } else {
        item.price = `${currentAmount.toFixed(2)} ${currency}`;
      }

      return item;
    }),
    timestamp: new Date().toISOString(),
  };
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const products = await fetchShopifyProducts();
    const feed = formatForMeta(products);
    return res.status(200).json(feed);
  } catch (error) {
    console.error('Feed error:', error);
    return res.status(500).json({ error: error.message });
  }
};
