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
                  compareAtPrice {
                    amount
                  }
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

function formatAsCSV(products) {
  const headers = ['id', 'title', 'description', 'availability', 'condition', 'price', 'sale_price', 'link', 'image_link', 'brand', 'google_product_category'];
  const csv = [headers.join(',')];

  products.forEach(p => {
    const currentAmount = parseFloat(p.priceRange.minVariantPrice.amount);
    const compareAmount = p.variants?.edges?.[0]?.node?.compareAtPrice?.amount
      ? parseFloat(p.variants.edges[0].node.compareAtPrice.amount)
      : null;
    const currency = p.priceRange.minVariantPrice.currencyCode;

    let price, salePrice;
    if (compareAmount && compareAmount > currentAmount) {
      price = `${compareAmount.toFixed(2)} ${currency}`;
      salePrice = `${currentAmount.toFixed(2)} ${currency}`;
    } else {
      price = `${currentAmount.toFixed(2)} ${currency}`;
      salePrice = '';
    }

    const row = [
      p.handle,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.description?.replace(/<[^>]*>/g, '').replace(/"/g, '""') || ''}"`,
      'in stock',
      'new',
      price,
      salePrice,
      `https://www.fadycalzados.com/producto/${p.handle}`,
      `"${p.images.edges[0]?.node.url || ''}"`,
      'Fady Calzados',
      '187'
    ];
    csv.push(row.join(','));
  });

  return csv.join('\n');
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');

  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const products = await fetchShopifyProducts();
    const csv = formatAsCSV(products);
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Feed error:', error);
    return res.status(500).send(`Error: ${error.message}`);
  }
};
